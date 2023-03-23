/* eslint-disable @typescript-eslint/naming-convention */
import React from "react"
import { GlobalRoomListInterface } from "utils/rooms"

export type RoomsSearchDataContextProps = {
  isRoomsSearching: boolean
  setIsRoomsSearching: (val: boolean) => void
  date: Date
  setDate: (date: Date) => void
  rooms: GlobalRoomListInterface
  setRooms: (newRooms: GlobalRoomListInterface) => void
}

export const RoomsSearchDataContext =
  React.createContext<RoomsSearchDataContextProps>({
    isRoomsSearching: false,
    setIsRoomsSearching: () => null,
    date: new Date("2022-05-18T12:15:00Z"),
    setDate: () => null,
    rooms: {
      MIA: [],
      MIB: [],
      CRG: [],
      LCF: [],
      PCL: [],
      MNI: [],
    },
    setRooms: () => null,
  })
