import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Activity } from "shared/models/activity"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface StateList {
  type: "present" | "late" | "absent" | "unmark" | "all"
  count: number
}

export const ActivityListTile = ({ activity }: { activity: Activity }) => {
  const [attendance, setAttendance] = useState({
    present: 0,
    late: 0,
    absent: 0,
  })

  const [stateList, setStateList] = useState<StateList[]>([
    { type: "all", count: 0 },
    { type: "present", count: 0 },
    { type: "late", count: 0 },
    { type: "absent", count: 0 },
  ])

  useEffect(() => {
    let present_count = 0;
    let late_count = 0; 
    let absent_count = 0;

    activity?.entity?.student_roll_states.forEach((r) => {
        if(r.roll_state === 'present') present_count++
        if(r.roll_state === 'late') late_count++
        if(r.roll_state === 'absent') absent_count++
    })

    setStateList([
        { type: "all", count: activity?.entity?.student_roll_states.length },
        { type: "present", count: present_count },
        { type: "late", count: late_count },
        { type: "absent", count: absent_count },
    ])
  }, [])

  return (
    <S.Container>
      <S.Content>
        <div>{activity?.entity?.name}</div>
      </S.Content>
      <S.Content>{<div>{new Date(activity?.date).toDateString()}</div>}</S.Content>
      <S.ListContainer>
        {stateList.map((s, i) => {
          if (s.type === "all") {
            return (
              <S.ListItem key={i}>
                <FontAwesomeIcon icon="users" size="sm" />
                <span>{s.count}</span>
              </S.ListItem>
            )
          }

          return (
            <S.ListItem key={i}>
              <RollStateIcon type={s.type} size={14} />
              <span>{s.count}</span>
            </S.ListItem>
          )
        })}
      </S.ListContainer>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    margin-top: ${Spacing.u3};
    padding-right: ${Spacing.u2};
    display: flex;
    align-items: center;
    height: 60px;
    border-radius: ${BorderRadius.default};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.3s ease-in-out;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
  ListContainer: styled.div`
    display: flex;
    align-items: center;
  `,
  ListItem: styled.div`
    display: flex;
    align-items: center;
    margin-right: ${Spacing.u2};

    span {
      font-weight: ${FontWeight.strong};
      margin-left: ${Spacing.u2};
    }
  `,
}
