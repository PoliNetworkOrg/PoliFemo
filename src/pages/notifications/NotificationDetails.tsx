import { NotificationDisplayer } from "components/Notifications/NotificationDisplayer"
import { ScrollPage } from "components/PageLayout"
import { MainStackScreen } from "navigation/NavigationTypes"

export const NotificationDetails: MainStackScreen<
  "NotificationDetails"
> = props => {
  const { notification, category } = props.route.params

  return (
    <ScrollPage title={category}>
      <NotificationDisplayer notification={notification} />
    </ScrollPage>
  )
}
