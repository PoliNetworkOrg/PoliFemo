import { EventArg } from "@react-navigation/native"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { NotificationDisplayer } from "components/Notifications/NotificationDisplayer"
import { NotificationTile } from "components/Notifications/NotificationTile"
import { Title } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { useEffect, useRef, useState } from "react"
import { View } from "react-native"
import {
  getAllNotificationsOfCategory,
  NotificationStorage,
} from "utils/notifications"

export const NotificationsCategory: MainStackScreen<
  "NotificationsCategory"
> = props => {
  const { category, categoryId } = props.route.params

  const navigation = useNavigation()

  const [notifications, setNotifications] = useState<NotificationStorage[]>([])

  const [currentNotification, setCurrentNotification] = useState<
    NotificationStorage | undefined
  >(undefined)

  useEffect(() => {
    async function loadNotifications() {
      console.log("loading notifications")
      const notifications = await getAllNotificationsOfCategory(categoryId)

      setNotifications(notifications)
    }

    void loadNotifications()
  }, [])

  //Override back button press
  const currentNotificationRef = useRef(currentNotification)

  useEffect(() => {
    currentNotificationRef.current = currentNotification
  }, [currentNotification])

  const handleBack = (
    e: EventArg<
      "beforeRemove",
      true,
      {
        action: Readonly<{
          type: string
          payload?: object | undefined
          source?: string | undefined
          target?: string | undefined
        }>
      }
    >
  ) => {
    //if I dont use ref, currentNotification appears to be always undefined
    if (currentNotificationRef.current) {
      setCurrentNotification(undefined)
      e.preventDefault()
    }
  }

  useEffect(() => {
    navigation.addListener("beforeRemove", handleBack)

    return () => {
      navigation.removeListener("beforeRemove", handleBack)
    }
  }, [])

  return (
    <ContentWrapperScroll
      marginTop={106}
      navbarOptions={{
        overrideBackBehavior: () => {
          if (currentNotification) {
            setCurrentNotification(undefined)
          } else {
            navigation.goBack()
          }
        },
      }}
    >
      <View style={{ paddingTop: 28, flex: 1, marginBottom: 50 }}>
        <Title style={{ paddingLeft: 28 }}>{category}</Title>
        {!currentNotification ? (
          <View style={{ marginTop: 19, flex: 1 }}>
            {notifications.map((notification, index) => (
              <NotificationTile
                notification={notification}
                key={index}
                onPress={() => setCurrentNotification(notification)}
              />
            ))}
          </View>
        ) : (
          <NotificationDisplayer notification={currentNotification} />
        )}
      </View>
    </ContentWrapperScroll>
  )
}
