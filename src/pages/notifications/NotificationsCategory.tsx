import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { NotificationTile } from "components/Notifications/NotificationTile"
import { Title } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { useEffect, useState } from "react"
import { View } from "react-native"
import {
  getAllNotificationsOfCategory,
  NotificationStorage,
  setNotificationAsReadStorage,
} from "utils/notifications"

export const NotificationsCategory: MainStackScreen<
  "NotificationsCategory"
> = props => {
  const { category, categoryId } = props.route.params

  const { navigate } = useNavigation()

  const [notifications, setNotifications] = useState<NotificationStorage[]>([])

  const loadNotifications = async () => {
    console.log("loading notifications")
    const notifications = await getAllNotificationsOfCategory(categoryId)

    setNotifications(notifications)
  }

  //reload on navigation.GoBack from NotificationDetails
  useEffect(() => {
    props.navigation.addListener("focus", loadNotifications)

    return () => props.navigation.removeListener("focus", loadNotifications)
  }, [])

  return (
    <ContentWrapperScroll>
      <View style={{ paddingTop: 28, flex: 1, marginBottom: 50 }}>
        <Title style={{ paddingLeft: 28 }}>{category}</Title>
        <View style={{ marginTop: 19, flex: 1 }}>
          {notifications.map((notification, index) => (
            <NotificationTile
              key={index}
              showRipple={false}
              notification={notification}
              onPress={() => {
                navigate("NotificationDetails", {
                  category: category,
                  notification: notification,
                })

                if (notification.isRead === false) {
                  void setNotificationAsReadStorage(
                    notification.notification.identifier
                  )
                }
              }}
            />
          ))}
        </View>
      </View>
    </ContentWrapperScroll>
  )
}
