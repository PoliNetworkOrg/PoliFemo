import { HttpClient, RequestOptions } from "./HttpClient"

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
export interface RoomSimplified{
    roomId: number
    name: string
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
        const response = await client.poliNetworkInstance.get<Room>(
            "/v1/rooms/" + roomId,
            {
                ...options,
            }
        )
        return response.data
    },
}
