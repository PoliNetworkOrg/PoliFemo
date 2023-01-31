import React, { FC, useContext, useEffect, useState } from "react"
import { View } from "react-native"
import { PoliCarousel } from "./PoliCarousel"
import { LoginContext } from "utils/login"
import { Event } from "api/event"
import {
    WidgetType,
    CarouselItem,
    checkEventType,
    createWidget,
} from "utils/carousel"
import { api } from "api"

/**
 * Component that decides the content of the carousel.
 * In the future the logic bheind the highlights will be implemented here and it will pass
 * the correct data to the PolimiCarousel
 */
export const HighlightsManager: FC = () => {
    const { loggedIn, userInfo } = useContext(LoginContext)

    const [widgets, setWidgets] = useState<CarouselItem[]>([])

    /**
     * This function gets as parameters the list of events extracted and then it filters it.
     * @param events
     */
    const extractNextEvents = (events: Event[]) => {
        const filteredEvents = events.filter(x =>
            checkEventType(x.event_type.typeId)
        )

        const tempEvents: CarouselItem[] = []
        for (let i = 0; i < filteredEvents.length; i++) {
            tempEvents.push(createWidget(filteredEvents[i]))
        }
        setWidgets(tempEvents)
    }

    /**
     * This function calls the events API.
     * @param matricola
     * @param startDate
     * @param nEvents
     */
    const findNextEvents = async (
        matricola: string,
        startDate: string,
        nEvents: number
    ) => {
        try {
            const response = await api.events.get(matricola, startDate, nEvents)
            if (response.length !== 0) {
                //we extract the events if there is something
                extractNextEvents(response)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const dateStart = new Date().toISOString().slice(0, 10) //it's now
    const nEvents = 10 //idk, temporary solution

    useEffect(() => {
        if (loggedIn) {
            findNextEvents(
                userInfo.careers[0].matricola,
                dateStart,
                nEvents
            ).finally(() => console.log("Events Retrieved"))
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
                            date: "Lunedi 22 Ottobre 2022",
                            time: "8:00",
                            title: "Default Widget Missing",
                        },
                        {
                            id: 1,
                            type: WidgetType.DEADLINE,
                            date: "Martedi 23 Ottobre 2022",
                            time: "8:00",
                            title: "Default Widget Missing",
                        },
                        {
                            id: 2,
                            type: WidgetType.DEADLINE,
                            date: "Mercoledi 24 Ottobre 2022",
                            time: "8:00",
                            title: "Default Widget Missing",
                        },
                    ]}
                />
            )}
        </View>
    )
}
