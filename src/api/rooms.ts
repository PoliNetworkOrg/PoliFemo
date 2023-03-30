import { ValidAcronym } from "utils/rooms"
import { AuthType, HttpClient, RequestOptions } from "./HttpClient"
import { mapAxiosRequest } from "./mapAxiosRequest"
import { ApiCollection } from "./useApiCall"

/* eslint-disable @typescript-eslint/naming-convention */
export interface Room {
  room_id: number
  name: string
  building: string
  power: boolean
  link: string
  occupancy_rate: number | null
  occupancies: Occupancies
  latitude?: number
  longitude?: number
}

export type Occupancies = Record<
  string,
  { status: "FREE" | "OCCUPIED"; text: string | null }
>

export interface RoomSimplified {
  roomId: number
  name: string
  occupancies: Occupancies
  occupancyRate: number | undefined
}

export interface RoomDetails {
  name: string
  capacity: number
  building: string
  address: string
  power: boolean
}
export interface OccupancyInfo {
  room_id: number
  occupancy_rate: null | number
}

export enum ConstructionType {
  HEADQUARTER,
  CAMPUS,
  BUILDING,
}

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to Rooms.
 */
export const rooms = {
  /**
   * Retrieves available rooms from PoliNetwork server in a given time range.
   */
  getFreeRoomsDay(params: { date: string }, options?: RequestOptions) {
    const request = client.callPoliNetwork<{
      free_rooms: Record<ValidAcronym, Room[]>
    }>({
      url: "/v1/rooms/search_day",
      method: "GET",
      params: {
        date: params.date,
      },
      ...options,
    })
    return mapAxiosRequest(request, res => res.free_rooms)
  },

  getOccupancyRate(params: { roomId: number }, options?: RequestOptions) {
    const request = client.callPoliNetwork<OccupancyInfo>({
      url: `/v1/rooms/${params.roomId}/occupancy`,
      method: "GET",
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },

  postOccupancyRate(
    params: { roomId: number; rate: number },
    options?: RequestOptions
  ) {
    const request = client.callPoliNetwork({
      url: `/v1/rooms/${params.roomId}/occupancy`,
      method: "POST",
      params: { rate: params.rate },
      authType: AuthType.POLINETWORK,
      ...options,
    })
    return mapAxiosRequest(request, res => res)
  },

  /**
   * Retrieves room details from PoliNetwork Server.
   */
  getRoomInfo(params: { roomId: number }, options?: RequestOptions) {
    const response = client.callPoliNetwork<RoomDetails>({
      url: `/v1/rooms/${params.roomId}`,
      method: "GET",
      ...options,
    })
    return mapAxiosRequest(response, res => res)
  },
} satisfies ApiCollection
