import React, { FC } from "react"
import { View } from "react-native"
import { PoliCarousel } from "./PoliCarousel"

//just to test with same data
export interface CarouselItem {
    id: number
    date: string
    time: string
    title: string
    room: string
}
const data: CarouselItem[] = [
    {
        id: 0,
        date: "Lun 20/10/2022",
        time: "9:00",
        title: "ANALISI MATEMATICA 1 Squadra 1",
        room: "B.2.2.1",
    },
    {
        id: 1,
        date: "Mar 21/10/2022",
        time: "12:00",
        title: "ANALISI MATEMATICA 2",
        room: "B.2.2.10",
    },
    {
        id: 2,
        date: "Mer 22/10/2022",
        time: "8:00",
        title: "FONDAMENTI INFORMATICA",
        room: "B.2.2.1",
    },
    {
        id: 3,
        date: "Gio 23/10/2022",
        time: "18:00",
        title: "ACSO",
        room: "B.2.2.1",
    },
    {
        id: 4,
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
