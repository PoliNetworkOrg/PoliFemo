/* eslint-disable @typescript-eslint/naming-convention */
import React from "react"

export type TimeTableProps = {
  timeTableOpen: boolean
  setTimeTableOpen: (status: boolean) => void
}

export const TimeTableContext = React.createContext<TimeTableProps>({
  timeTableOpen: true,
  setTimeTableOpen: () => null,
})
