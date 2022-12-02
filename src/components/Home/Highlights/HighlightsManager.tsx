import React, { FC } from "react"
import { View } from "react-native"
import { PoliCarousel, WidgetType } from "./PoliCarousel"

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
        type: WidgetType.LECTURES,
        date: "Lun 20/10/2022",
        time: "9:00",
        title: "ANALISI MATEMATICA 1 Squadra 1",
        room: "B.2.2.1",
    },
    {
        id: 1,
        type: WidgetType.LECTURES,
        date: "Mar 21/10/2022",
        time: "12:00",
        title: "ANALISI MATEMATICA 2",
        room: "B.2.2.10",
    },
    {
        id: 2,
        type: WidgetType.ISEE,
        date: "Mer 22/10/2022",
        time: "8:00",
        title: "Scadenza ISEE 2023",
    },
    {
        id: 3,
        type: WidgetType.LECTURES,
        date: "Gio 23/10/2022",
        time: "18:00",
        title: "ACSO",
        room: "B.2.2.1",
    },
    {
        id: 4,
        type: WidgetType.LECTURES,
        date: "Ven 24/10/2022",
        time: "13:00",
        title: "ANALISI MATEMATICA 1 Squadra 2",
        room: "B.2.2.1",
    },
]

/**
 * Component that decides the content of the carousel.
 * In the future the logic bheind the highlights will be implemented here and it will pass
 * the correct data to the PolimiCarousel
 */
export const HighlightsManager: FC = () => {
    return (
        <View>
            <PoliCarousel dataToShow={data} />
        </View>
    )
}
