/* eslint-disable @typescript-eslint/naming-convention */
import { BuildingItem } from "pages/FreeClass/BuildingChoice"
import React from "react"
import { GlobalRoomListInterface, ValidAcronym } from "utils/rooms"

export type RoomsSearchDataContextProps = {
  currentBuilding: BuildingItem | undefined
} & {
  setCurrentBuilding: (building: BuildingItem | undefined) => void
} & {
  acronym: ValidAcronym | undefined
} & {
  setAcronym: (acronym: ValidAcronym) => void
} & { date: Date } & {
  setDate: (date: Date) => void
} & { rooms: GlobalRoomListInterface } & {
  setRooms: (newRooms: GlobalRoomListInterface) => void
}

export const RoomsSearchDataContext =
  React.createContext<RoomsSearchDataContextProps>({
    currentBuilding: undefined,
    setCurrentBuilding: () => null,
    acronym: "COE",
    setAcronym: () => null,
    date: new Date("2022-05-18T12:15:00Z"),
    setDate: () => null,
    rooms: {
      MIA: { rooms: [] },
      MIB: { rooms: [] },
      CRG: { rooms: [] },
      LCF: { rooms: [] },
      PCL: { rooms: [] },
      MNI: { rooms: [] },
      MIC: { rooms: [] },
      MID: { rooms: [] },
      COE: { rooms: [] },
    },
    setRooms: () => null,
  })
