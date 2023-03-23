import { GlobalRoomListInterface } from "utils/rooms"
import { AuthType, HttpClient, RequestOptions } from "./HttpClient"

/* eslint-disable @typescript-eslint/naming-convention */
export interface Rooms {
  free_rooms: GlobalRoomListInterface
}

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
  async getFreeRoomsDay(date: string, options?: RequestOptions) {
    const response = await client.poliNetworkInstance.get<Rooms>(
      "/v1/rooms/search_day",
      {
        ...options,
        params: {
          date: date,
        },
      }
    )
    return {
      data: response.data.free_rooms,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expire: response.headers["cache-control"] as string | undefined,
    }
  },

  async getOccupancyRate(roomId: number, options?: RequestOptions) {
    const response = await client.poliNetworkInstance.get<OccupancyInfo>(
      "/v1/rooms/" + roomId + "/occupancy",
      {
        ...options,
      }
    )
    return response.data
  },

  async postOccupancyRate(
    roomId: number,
    rate: number,
    options?: RequestOptions
  ) {
    const res = await client.poliNetworkInstance.post(
      "/v1/rooms/" + roomId + "/occupancy",
      {
        ...options,
      },
      { params: { rate: rate }, authType: AuthType.POLINETWORK }
    )
    return res
  },

  /**
   * Retrieves room details from PoliNetwork Server.
   */
  async getRoomInfo(roomId: number, options?: RequestOptions) {
    const response = await client.poliNetworkInstance.get<RoomDetails>(
      "/v1/rooms/" + roomId,
      {
        ...options,
      }
    )
    return response.data
  },
}
