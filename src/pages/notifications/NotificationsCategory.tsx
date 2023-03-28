import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { NotificationTile } from "components/Notifications/NotificationTile"
import { Title } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View } from "react-native"
import {
  setNotificationAsReadStorage,
  useNotificationStorage,
} from "utils/notifications"

export const NotificationsCategory: MainStackScreen<
  "NotificationsCategory"
> = props => {
  const { category, categoryId } = props.route.params

  const { navigate } = useNavigation()

  const [notifications] = useNotificationStorage(categoryId, props.navigation)

  return (
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
                  void setNotificationAsReadStorage(notification.identifier)
                }
              }}
            />
          ))}
        </View>
      </View>
    </ContentWrapperScroll>
  )
}
