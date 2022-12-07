import React, { FC, useEffect } from "react"
import { View } from "react-native"
import { PoliCarousel, WidgetType } from "./PoliCarousel"
import lectures from "./lectures.json"
import { api, Lecture } from "api"

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

//just to test with same static data
const data: CarouselItem[] = [
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
]

/**
 * this function calls the api to get the data
 * temporarly disabled!So far I am using the lecture.json file because the api returns data only in the past
 */
const getTimetable = () => {
    api.getTimetable()
        .then(response => {
            const timetable = response
        })
        .catch(err => console.log(err))
}

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
        //unary (+) operator converts an operand (new Date()) into a number
        if (+new Date(a.date_start) != +new Date(b.date_start)) {
            return +new Date(a.date_start) - +new Date(b.date_start)
        } else {
            return +new Date(a.date_end) - +new Date(b.date_end)
        }
    })
    const currentDate = new Date().toISOString().slice(0, 10)
    const currentTime = new Date().toLocaleTimeString() //in order to get the current local time
    const now = currentDate + "T" + currentTime

    for (let i = 0; i < sorted.length; i++) {
        if (
            new Date(sorted[i].date_start) > new Date(now) ||
            (new Date(now) > new Date(sorted[i].date_start) &&
                new Date(now) < new Date(sorted[i].date_end))
        ) {
            const currentObject = sorted[i]
            const nextLecture: CarouselItem = {
                id: currentObject.event_id,
                type: WidgetType.LECTURES,
                date: new Date(currentObject.date_start).toLocaleDateString(
                    "it-IT",
                    {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        weekday: "short", //problem: it is not capitalized!
                    }
                ),
                time: currentObject.date_start.toString().slice(11, 16),
                title: currentObject.title.it,
                room: currentObject.room.acronym_dn,
            }
            addItem(nextLecture)
            break
        }
    }
}

const addItem = (item: CarouselItem) => {
    data.push(item)
}

/**
 * Component that decides the content of the carousel.
 * In the future the logic bheind the highlights will be implemented here and it will pass
 * the correct data to the PolimiCarousel
 */
export const HighlightsManager: FC = () => {
    useEffect(() => findNextLecture(lectures), [])

    return (
        <View>
            <PoliCarousel dataToShow={data} />
        </View>
    )
}
