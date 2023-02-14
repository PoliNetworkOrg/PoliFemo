import { ValidCrowdStatus } from "components/FreeClass/ClassDetails/CrowdingSection"
import { AuthType, HttpClient, RequestOptions } from "./HttpClient"

/* eslint-disable @typescript-eslint/naming-convention */
export interface Rooms {
    freeRooms: Room[]
}
export interface Room {
    room_id: number
    name: string
    building: string
    power: boolean
    link: string
}

export interface RoomDetails {
    name: string
    capacity: string
    building: string
    address: string
    power: boolean
}

export interface OccupancyInfo {
    room_id: number
    occupancy_rate: null | ValidCrowdStatus
}

const client = HttpClient.getInstance()

/**
 * Collection of endpoints related to Rooms.
 */
export const rooms = {
    /**
     * Retrieves available rooms from PoliNetwork server in a given time range.
     */
    async getFreeRoomsTimeRange(
        campusAcronym: string,
        dateStart: string,
        dateEnd: string,
        options?: RequestOptions
    ) {
        const response = await client.poliNetworkInstance.get<Rooms>(
            "/v1/rooms/search",
            {
                ...options,
                params: {
                    sede: campusAcronym,
                    hourStart: dateStart,
                    hourStop: dateEnd,
                },
            }
        )
        return response.data.freeRooms
    },

    async getRoomInfo(roomId: number, options?: RequestOptions) {
        const response = await client.poliNetworkInstance.get<RoomDetails>(
            "/v1/rooms/" + roomId,
            {
                ...options,
            }
        )
        return response.data
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
}
