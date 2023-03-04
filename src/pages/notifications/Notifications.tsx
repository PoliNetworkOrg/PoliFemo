import React, { useState } from "react"
import { View } from "react-native"
import { NotificationsStackScreen } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Category } from "components/Notifications/Category"

export const NotificationsPage: NotificationsStackScreen<
  "Notifications"
> = () => {
  const [toggled, setToggled] = useState<boolean>(true)
  const categories = [
    {
      // icon:
      title: "Comunicazioni istituzionali",
      notifications: 2, // TODO: get the real number
      onPress: () => console.log("comunicazioni istituzionali!"),
      key: 0, // better key?
    },
    {
      // icon:
      title: "Associazioni",
      notifications: 3, // TODO: get the real number
      onPress: () => console.log("associazioni!"),
      key: 1, // better key?
    },
    {
      // icon:
      title: "Nuovi Upload",
      notifications: 0, // TODO: get the real number
      onPress: () => console.log("nuovi upload"),
      key: 2, // better key?
    },
  ]

  return (
    <View style={{ flex: 1 }}>
      <ContentWrapperScroll title="">
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          {categories.map(c => {
            return (
              <Category
                title={c.title}
                showSwitch={true}
                switchControl={{
                  toggled: toggled,
                  onToggle: value => setToggled(value),
                }}
                notifications={c.notifications}
                key={c.key}
              />
            )
          })}
        </View>
      </ContentWrapperScroll>
    </View>
  )
}
