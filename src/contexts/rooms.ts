/* eslint-disable @typescript-eslint/naming-convention */
import React from "react"
import { GlobalRoomListInterface } from "utils/rooms"

export type RoomsSearchDataContextProps = {
  isRoomsSearching: boolean
  date: Date
  setDate: (date: Date) => void
  rooms: GlobalRoomListInterface
}

export const RoomsSearchDataContext =
  React.createContext<RoomsSearchDataContextProps>({
    isRoomsSearching: false,
    date: new Date(),
    setDate: () => null,
    rooms: {
      MIA: [],
      MIB: [],
      CRG: [],
      LCF: [],
      PCL: [],
      MNI: [],
    },
  })
