import { FC, useContext, useEffect, useState } from "react"
import { View } from "react-native"
import { PoliCarousel } from "./PoliCarousel"
import { LoginContext } from "contexts/login"
import { Event } from "api/collections/event"
import {
  CarouselItem,
  checkEventType,
  createWidget,
  WidgetType,
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
    let firstLecture = true
    return events
      .filter(x => checkEventType(x.event_type.typeId))
      .filter(x => {
        if (x.event_type.typeId === WidgetType.LECTURES) {
          if (firstLecture) {
            firstLecture = false
            return true
          }
          return false
        } else return true
      })
      .map(e => createWidget(e))
  }

  /**
   * This function calls the events API.
   */
  const setNextEvents = async () => {
    if (!loggedIn) return
    try {
      const { matricola } = userInfo.careers[0]
      const startDate = new Date().toISOString().substring(0, 10)
      const response = await api.events.getEvents(
        matricola,
        startDate,
        10 //nEvents 10
      )
      if (response.length !== 0) {
        //we extract the events if there is something
        const newWidgets = extractNextEvents(response)
        setWidgets(newWidgets)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (loggedIn) {
      void setNextEvents()
    } else {
      setWidgets([])
    }
  }, [loggedIn])

  return (
    <View>
      <PoliCarousel dataToShow={widgets} />
    </View>
  )
}
