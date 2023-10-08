/* eslint-disable @typescript-eslint/naming-convention */
import React from "react"
import { Region } from "react-native-maps"
import { GlobalRoomListInterface } from "utils/rooms"

export type RoomsSearchDataContextProps = {
  isRoomsSearching: boolean
  date: Date
  setDate: (date: Date) => void
  rooms: GlobalRoomListInterface
  currentRegionMap: Region
  setCurrentRegionMap: (region: Region) => void
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
    currentRegionMap: {
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    },
    setCurrentRegionMap: () => null,
  })
