import React, { FC, useContext, useEffect, useState } from "react"
import { View } from "react-native"
import { PoliCarousel } from "./PoliCarousel"
import { LoginContext } from "utils/login"
import { Event } from "api/event"
import { WidgetType, CarouselItem } from "utils/carousel"
import { events } from "api/event"


/**
 * Component that decides the content of the carousel.
 * In the future the logic bheind the highlights will be implemented here and it will pass
 * the correct data to the PolimiCarousel
 */
export const HighlightsManager: FC = () => {
    const { loggedIn, userInfo } = useContext(LoginContext)

    const [widgets, setWidgets] = useState<CarouselItem[]>([])

    //function used to add a "0" to the day is this one is lower than 10 (ex. n=8 -> res=08)
    const pad = (n: number) => {
        return n < 10 ? "0" + n : n
    }

    const days = [
        "Lunedi",
        "Martedi",
        "Mercoledi",
        "Giovedi",
        "Venerdi",
        "Sabato",
        "Domenica",
    ]
    const months = [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
    ]

    const extractNextEvents = (events: Event[]) => {
        //idk, maybe it's not the best solution
        function checkEventType(type: string) {
            return type === "Lezione" || type === "Esame" || type === "Deadline"
        }

        const filteredEvents = events.filter(x =>
            checkEventType(x.event_type.type_dn.it)
        )

        //Limit the number of elements of the carousel to 10, could be changed
        const numOfElements =
            filteredEvents.length > 10 ? 10 : filteredEvents.length

        const tempEvents: CarouselItem[] = []
        for (let i = 0; i < numOfElements; i++) {
            const currentObject = filteredEvents[i]
            const dateObj = new Date(currentObject.date_start)
            const resultDate =
                days[(dateObj.getDay() - 1 + 7) % 7] +
                " " +
                pad(dateObj.getDate()) +
                " " +
                months[dateObj.getMonth()] +
                " " +
                dateObj.getFullYear()
            const nextEvent: CarouselItem = {
                id: currentObject.event_id,
                type: currentObject.event_type.typeId,
                date: resultDate,
                time: currentObject.date_start.toString().slice(11, 16),
                title: currentObject.title.it,
                room:
                    currentObject.room !== undefined
                        ? currentObject.room.acronym_dn
                        : undefined,
            }
            tempEvents.push(nextEvent)
        }
        setWidgets(tempEvents)
    }

    const findNextEvents = async (
        matricola: string,
        startDate: string,
        nEvents: number
    ) => {
        try {
            const response = await events.getEvents(
                matricola,
                startDate,
                nEvents,
            )
            console.log(response) //print the list of events
            extractNextEvents(response)
        } catch (error) {
            console.log(error)
        }
    }

    const dateStart = new Date().toISOString().slice(0,10) //it's now

    useEffect(() => {
        console.log("inizio")
        if (loggedIn){
            findNextEvents(userInfo.careers[0].matricola, dateStart, 10).finally(()=>console.log("fine"))
        }
    }, [loggedIn])

    return (
        <View>
            {loggedIn && widgets.length > 0 ? (
                <PoliCarousel dataToShow={widgets} />
            ) : (
                //with static data, just to see it! We need a default widget
                <PoliCarousel
                    dataToShow={[
                        {
                            id: 0,
                            type: WidgetType.DEADLINE,
                            date: "Mercoledi 22 Ottobre 2022",
                            time: "8:00",
                            title: "Scadenza ISEE 2023",
                        },
                        {
                            id: 1,
                            type: WidgetType.DEADLINE,
                            date: "Mercoledi 22 Ottobre 2022",
                            time: "8:00",
                            title: "Scadenza ISEE 2023",
                        },
                        {
                            id: 2,
                            type: WidgetType.DEADLINE,
                            date: "Mercoledi 22 Ottobre 2022",
                            time: "8:00",
                            title: "Scadenza ISEE 2023",
                        },
                    ]}
                />
            )}
        </View>
    )
}
