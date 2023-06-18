import React, { useState, useEffect } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import TextField from "@material-ui/core/TextField"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person, PersonHelper } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import SortDropdown, { ToolbarAction } from "staff-app/components/header/dropDown.component"
import { RollStateType } from "shared/models/roll"

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [searchStudents, setSearchStudents] = useState<Person[]>([])
  const [students, setStudents] = useState<Person[]>([])
  const [attendance, setAttendance] = useState({
    present: 0,
    late: 0,
    absent: 0,
  })
  const [isSortDropdownOpen, setIsisSortDropdownOpen] = useState<Boolean>(false)
  const [sortAction, setSortAction] = useState<ToolbarAction>("")
  const [filterStudent, setFilterStudent] = useState("all")
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    if (loadState === "loaded") {
      if (isRollMode) {
        data!.students.forEach((s) => {
          s.rollState = "unmark"
        })
      }
      setStudents(data!.students)
      setSearchStudents(data!.students)
    }
  }, [loadState, isRollMode])

  const onToolbarAction = (action: ToolbarAction) => {
    if (action !== "roll") {
      setSortAction(action)
    }

    if (action === "roll") {
      setIsRollMode(true)
    }

    if (loadState === "loaded") {
      action === "first_name_asc" && setSearchStudents(() => [...searchStudents.sort((a, b) => (a.first_name.toLowerCase() > b.first_name.toLowerCase() ? 1 : -1))])
      action === "first_name_dec" && setSearchStudents(() => [...searchStudents.sort((a, b) => (a.first_name.toLowerCase() < b.first_name.toLowerCase() ? 1 : -1))])
      action === "last_name_asc" && setSearchStudents(() => [...searchStudents.sort((a, b) => (a.last_name.toLowerCase() > b.last_name.toLowerCase() ? 1 : -1))])
      action === "last_name_dec" && setSearchStudents(() => [...searchStudents.sort((a, b) => (a.last_name.toLowerCase() < b.last_name.toLowerCase() ? 1 : -1))])
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const onStudentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.trim()) {
      const searchedStudents = students.filter((student) => PersonHelper.getFullName(student).toUpperCase().includes(e.target.value.toUpperCase()))
      setSearchStudents(() => [...searchedStudents])
    } else {
      setSearchStudents(() => [...students])
    }
  }

  function getAttendance(id: number, rollState: RollStateType) {
    searchStudents?.forEach((s) => s.id === id && (s.rollState = rollState))

    let presentCount = 0
    let lateCount = 0
    let absentCount = 0

    searchStudents.forEach((s) => {
      if (s.rollState === "present") presentCount++
      if (s.rollState === "late") lateCount++
      if (s.rollState === "absent") absentCount++
    })

    setAttendance((prev) => {
      return { ...prev, present: presentCount, late: lateCount, absent: absentCount }
    })
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar
          sortAction={sortAction}
          onItemClick={onToolbarAction}
          onStudentSearch={onStudentSearch}
          setIsisSortDropdownOpen={setIsisSortDropdownOpen}
          isSortDropdownOpen={isSortDropdownOpen}
        />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
              {searchStudents
              .filter((student) => {
                if (filterStudent === "all") return student
                else if (student.rollState === filterStudent) return student
              })
              .map((s) => (
                <StudentListTile key={s.id} isRollMode={isRollMode} student={s} getAttendance={getAttendance} />
              ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay filterStudent={setFilterStudent} isActive={isRollMode} studentAttendance={{ total: students?.length, ...attendance }} onItemClick={onActiveRollAction} />
    </>
  )
}
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  onStudentSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  setIsisSortDropdownOpen: (e: Boolean) => void
  isSortDropdownOpen: Boolean
  sortAction: ToolbarAction
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, onStudentSearch, setIsisSortDropdownOpen, isSortDropdownOpen, sortAction } = props
  return (
    <S.ToolbarContainer>
      <S.Button onClick={() => setIsisSortDropdownOpen(true)}>
        Full Name <FontAwesomeIcon icon="sort" size="1x" style={{ marginLeft: `${Spacing.u1}` }} />
      </S.Button>

      {isSortDropdownOpen && <SortDropdown onItemClick={onItemClick} setIsSortDropdownOpen={setIsisSortDropdownOpen} sortAction={sortAction} />}
      <S.StyledTextField className="searchTextField" label="Search" variant="standard" onChange={onStudentSearch} />
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
    position: relative;
  `,
  StyledTextField: styled(TextField)`
    && {
      color: #fff;
      .MuiFormLabel-root {
        color: #fff;
      }
      .MuiInputBase-root {
        border-radius: 4px;
        padding: ${Spacing.u1};
        margin-top: 0px;
        color: #fff;
      }
      .MuiInputBase-input {
        /* padding: ${Spacing.u2}; */
      }
    }
  `,
  Button: styled(Button)`
    && {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
}
