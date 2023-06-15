import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { NotificationTile } from "components/Notifications/NotificationTile"
import { Title } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View } from "react-native"
import { NotificationCenter } from "notifications/NotificationCenter"
import { useNotificationStorage } from "notifications/useNotificationStorage"

/* import { GestureHandlerRootView } from "react-native-gesture-handler" */

const notificationCenter = NotificationCenter.getInstance()

export const NotificationsCategory: MainStackScreen<
  "NotificationsCategory"
> = props => {
  const { category, channelId } = props.route.params

  const { navigate } = useNavigation()

  const [notifications] = useNotificationStorage(channelId, props.navigation)

  return (
    /* <GestureHandlerRootView style={{ flex: 1 }}> */
    <ContentWrapperScroll>
      <View style={{ paddingTop: 28, flex: 1, marginBottom: 50 }}>
        <Title style={{ paddingLeft: 28 }}>{category}</Title>
        <View style={{ marginTop: 19, flex: 1 }}>
          {notifications.map(notification => (
            <NotificationTile
              key={notification.identifier}
              showRipple={false}
              notification={notification}
              onPress={() => {
                navigate("NotificationDetails", {
                  category: category,
                  notification: notification,
                })

                if (notification.isRead === false) {
                  void notificationCenter.markAsRead(notification.identifier)
                }
              }}
            />
          ))}
        </View>
      </View>
    </ContentWrapperScroll>
    /* </GestureHandlerRootView> */
  )
}
