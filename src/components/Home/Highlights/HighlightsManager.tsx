import React, { FC, useEffect, useState } from "react"
import { View } from "react-native"
import { PoliCarousel, WidgetType } from "./PoliCarousel"
import lectures from "./lectures.json"
import { Lecture } from "api/timetable"

//ideally this is the object we want to pass to the carousel
//this might be expansed in the future
export interface CarouselItem {
    /**
     * number to identify the object and the relative widget
     */
    id: number
    /**
     * enum field to identify the type of the widget
     */
    type: WidgetType
    /**
     * string to identify the date of the event(or deadline) contained in the widget
     */
    date: string
    /**
     * string to identify the time of the event(or deadline) contained in the widget
     */
    time: string
    /**
     * string to identify the title of the event contained in the widget
     */
    title: string
    /**
     * string to identify eventually the room when the event takes place
     */
    room?: string
}

/**
 * Component that decides the content of the carousel.
 * In the future the logic bheind the highlights will be implemented here and it will pass
 * the correct data to the PolimiCarousel
 */
export const HighlightsManager: FC = () => {
    const [isLessonFound, setIsLessonFound] = useState(false)
    const [data, setData] = useState<CarouselItem[]>([
        {
            id: 0,
            type: WidgetType.ISEE,
            date: "Mer 22/10/2022",
            time: "8:00",
            title: "Scadenza ISEE 2023",
        },
        {
            id: 1,
            type: WidgetType.ISEE,
            date: "Mer 22/10/2022",
            time: "8:00",
            title: "Scadenza ISEE 2023",
        },
        {
            id: 2,
            type: WidgetType.ISEE,
            date: "Mer 22/10/2022",
            time: "8:00",
            title: "Scadenza ISEE 2023",
        },
    ])

    //function used to add a "0" to the day is this one is lower than 10 (ex. n=8 -> res=08)
    const pad = (n: number) => {
        return n < 10 ? "0" + n : n
    }

    const days = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"]

    /**
     * function to determine which is the next lesson according to the current date and time
     * @param timetable is the API response
     */
    const findNextLecture = (timetable: Lecture[]) => {
        /**
         * sorting dates in ascending order, priority is the 'date_start' field.If there are two lecture with the same
         * 'date_start' we check the 'date_end' field!
         * @example
         * lecture 1{date_start: "2022-12-04T08:15:00",date_end: "2022-12-04T13:15:00"}
         * lecture 2{date_start: "2022-12-04T08:15:00",date_end: "2022-12-04T14:00:00"}
         * So in this case lecture 1 has more priority than lecture 2
         */
        const sorted = timetable.sort((a, b) => {
            let dateA = new Date(a.date_start).getTime()
            let dateB = new Date(b.date_start).getTime()
            if (dateA !== dateB) {
                return dateA - dateB
            } else {
                dateA = new Date(a.date_end).getTime()
                dateB = new Date(b.date_end).getTime()
                return dateA - dateB
            }
        })

        const now = new Date()

        for (let i = 0; i < sorted.length; i++) {
            if (
                new Date(sorted[i].date_start) > new Date(now) ||
                (new Date(now) > new Date(sorted[i].date_start) &&
                    new Date(now) < new Date(sorted[i].date_end))
            ) {
                const currentObject = sorted[i]
                const dateObj = new Date(currentObject.date_start)
                const resultDate =
                    days[(dateObj.getDay() - 1 + 7) % 7] +
                    " " +
                    pad(dateObj.getDate()) +
                    "/" +
                    (dateObj.getMonth() + 1) +
                    "/" +
                    dateObj.getFullYear()
                const nextLecture: CarouselItem = {
                    id: currentObject.event_id,
                    type: WidgetType.LECTURES,
                    date: resultDate,
                    time: currentObject.date_start.toString().slice(11, 16),
                    title: currentObject.title.it,
                    room: currentObject.room.acronym_dn,
                }
                setData([nextLecture, ...data])
                setIsLessonFound(true)
                break
            }
        }
    }

    useEffect(
        () => (!isLessonFound ? findNextLecture(lectures) : undefined),
        [isLessonFound]
    )

    return (
        <View>
            <PoliCarousel dataToShow={data} />
        </View>
    )
}
