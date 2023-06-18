import React, { useState } from "react"
import { Person } from "shared/models/person"
import { RollStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"

interface Props {
  initialState?: RollStateType
  size?: number
  onStateChange?: (newState: RollStateType) => void
  getAttendance: (id: number, rollState: RollStateType) => void
  student: Person
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, getAttendance, student }) => {
  const [rollState, setRollState] = useState(student?.rollState || initialState)

  const nextState = () => {
    const states: RollStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    rollState === "unmark" && getAttendance(student.id, "present")
    rollState === "present" && getAttendance(student.id, "late")
    rollState === "late" && getAttendance(student.id, "absent")
    rollState === "absent" && getAttendance(student.id, "present")
    const next = nextState()
    setRollState(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
