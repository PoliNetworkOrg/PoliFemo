import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { NotificationData } from "components/Notifications"
import { NotificationDisplayer } from "components/Notifications/NotificationDisplayer"
import { NotificationTile } from "components/Notifications/NotificationTile"
import { Title } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import React, { useState } from "react"
import { View } from "react-native"

export const NotificationsCategory: MainStackScreen<
  "NotificationsCategory"
> = props => {
  const { category, notifications } = props.route.params

  const navigation = useNavigation()

  const [currentNotification, setCurrentNotification] = useState<
    NotificationData | undefined
  >(undefined)

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
      <View style={{ paddingTop: 28, flex: 1 }}>
        <View style={{ flex: 1 }}>
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
      </View>
    </ContentWrapperScroll>
  )
}
