import { FC, useContext, useEffect } from "react"
import { View } from "react-native"
import { PoliCarousel } from "./PoliCarousel"
import { LoginContext } from "contexts/login"
import { extractNextEvents } from "utils/carousel"
import { api } from "api"
import { NotificationCenter } from "notifications/NotificationCenter"
import { extractAllEvents } from "utils/notifications"
import { useApiCall } from "api/useApiCall"

const notificationCenter = NotificationCenter.getInstance()

/**
 * Component that decides the content of the carousel.
 * In the future the logic bheind the highlights will be implemented here and it will pass
 * the correct data to the PolimiCarousel
 */
export const HighlightsManager: FC = () => {
  const { loggedIn, userInfo } = useContext(LoginContext)

  const { matricola } = userInfo?.careers?.[0] ?? {}
  const startDate = new Date().toISOString().substring(0, 10)
  const [events] = useApiCall(
    api.events.getEvents,
    {
      matricola: matricola ?? "",
      startDate,
      nEvents: 10,
    },
    [loggedIn],
    {},
    !loggedIn // only call if logged in
  )
  const widgets = extractNextEvents(events ?? [])

  useEffect(() => {
    if (events) {
      void notificationCenter.scheduleCarousel(extractAllEvents(events))
    }
  }, [events])

  return (
    <View>
      <PoliCarousel dataToShow={widgets} />
    </View>
  )
}
