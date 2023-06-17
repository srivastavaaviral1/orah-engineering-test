import React, { useState } from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"

import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Button } from "@material-ui/core"


export type ToolbarAction = "roll" | "first_name_asc" | "first_name_dec" | "last_name_asc" | "last_name_dec" | ""

interface SortDropdownProps {
  onItemClick: (action: ToolbarAction, value?: string) => void
  setIsSortDropdownOpen: (e: Boolean) => void
  sortAction: ToolbarAction
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onItemClick, setIsSortDropdownOpen, sortAction }) => {
  const [selectedOption, setSelectedOption] = useState<ToolbarAction>(sortAction)

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value)
  }

  return (
    <S.DropdownContainer>
      <FormControl component="fieldset" >
        <RadioGroup value={selectedOption} onChange={handleOptionChange}>
          <FormControlLabel value="first_name_asc" control={<Radio color="primary" />} label="First Name A-Z" />
          <FormControlLabel value="first_name_dec" control={<Radio color="primary" />} label="First Name Z-A" />
          <FormControlLabel value="last_name_asc" control={<Radio color="primary" />} label="Last Name A-Z" />
          <FormControlLabel value="last_name_dec" control={<Radio color="primary" />} label="Last Name Z-A" />
        </RadioGroup>
        <S.ButtonContainer onClick={() =>  setIsSortDropdownOpen(false)}>
        <S.Button onClick={() => onItemClick("")}>Clear</S.Button>
        <S.Button
          onClick={() => {
            onItemClick(selectedOption)
          }}
        >
          Confirm
        </S.Button>
        </S.ButtonContainer>
      </FormControl>
    </S.DropdownContainer>

  )
}
const S = {
    DropdownContainer: styled.div`
      position: absolute;
      background-color: ${Colors.blue.base};
      padding: ${Spacing.u4};
      border-radius: ${BorderRadius.default}; 
      top: 100%;
      left: 0;
      margin-top: ${Spacing.u1};
    `,
    ButtonContainer: styled.div`
            display: flex;
            margin-top: ${Spacing.u2};
           
    `,
      Button: styled(Button)`
      && {
        color: #fff;
        padding: ${Spacing.u2};
        font-weight: ${FontWeight.strong};
        border-radius: ${BorderRadius.default};
      }
    `,
  }

export default SortDropdown
