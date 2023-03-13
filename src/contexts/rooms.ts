/* eslint-disable @typescript-eslint/naming-convention */
import React from "react"
import { GlobalRoomListInterface, ValidAcronym } from "utils/rooms"

export type RoomsSearchDataContextProps = {
  isRoomsSearching: boolean
  setIsRoomsSearching: (val: boolean) => void
  acronym: ValidAcronym
  setAcronym: (acronym: ValidAcronym) => void
  date: Date
  setDate: (date: Date) => void
  rooms: GlobalRoomListInterface
  setRooms: (newRooms: GlobalRoomListInterface) => void
}

export const RoomsSearchDataContext =
  React.createContext<RoomsSearchDataContextProps>({
    isRoomsSearching: false,
    setIsRoomsSearching: () => null,
    acronym: "MIA",
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
    },
    setRooms: () => null,
  })
