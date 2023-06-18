import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { Card, CardContent, Chip, Typography } from "@material-ui/core"

import { useApi } from "shared/hooks/use-api"
import { Activity } from "shared/models/activity"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"

import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Images } from "assets/images"
import { ActivityListTile } from "./activityList.page"


export const ActivityPage: React.FC = () => {
  const [getActivities, activityData, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <S.Wrapper>
      {loadState === "loading" && (
        <CenteredContainer>
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}
      {loadState === "loaded" && activityData?.activity && (
        <>
          {activityData?.activity?.map((a) => (
            <ActivityListTile activity={a} key={a.entity.id} />
          ))}
          {/* {activityData?.activity[activityData?.activity.length - 1].entity.student_roll_states.map((studentData) => {
            return (
              <S.Container>
                <S.Avatar url={Images.avatar}></S.Avatar>
                <S.Content>
                  <div>{'Aviral'}</div>
                </S.Content>
                <RollStateIcon type={studentData.roll_state} size={30}  />
              </S.Container>
            )
          })} */}
        </>
      )}
      {loadState === "error" && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}
    </S.Wrapper>
  )
}

const S = {
  Wrapper: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 0;
  `,
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
  Avatar: styled.div<{ url: string }>`
    width: 60px;
    background-image: url(${({ url }) => url});
    border-top-left-radius: ${BorderRadius.default};
    border-bottom-left-radius: ${BorderRadius.default};
    background-size: cover;
    background-position: 50%;
    align-self: stretch;
  `,
  Content: styled.div`
    flex-grow: 1;
    padding: ${Spacing.u2};
    color: ${Colors.dark.base};
    font-weight: ${FontWeight.strong};
  `,
}
