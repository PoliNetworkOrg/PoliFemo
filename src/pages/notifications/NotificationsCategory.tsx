import { NotificationTile } from "components/Notifications/NotificationTile"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { NotificationCenter } from "notifications/NotificationCenter"
import { useNotificationStorage } from "notifications/useNotificationStorage"
import { ListPage } from "components/PageLayout"

/* import { GestureHandlerRootView } from "react-native-gesture-handler" */

const notificationCenter = NotificationCenter.getInstance()

export const NotificationsCategory: MainStackScreen<
  "NotificationsCategory"
> = props => {
  const { category, channelId } = props.route.params

  const { navigate } = useNavigation()

  const [notifications] = useNotificationStorage(channelId, props.navigation)

  return (
    <ListPage
      title={category}
      data={notifications}
      renderItem={({ item }) => (
        <NotificationTile
          key={item.identifier}
          showRipple={false}
          notification={item}
          onPress={() => {
            navigate("NotificationDetails", {
              category: category,
              notification: item,
            })

            if (item.isRead === false) {
              void notificationCenter.markAsRead(item.identifier)
            }
          }}
        />
      )}
    />
  )
}
