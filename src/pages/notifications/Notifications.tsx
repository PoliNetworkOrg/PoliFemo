import React, { useState } from "react"
import { View } from "react-native"
import { MainStackScreen } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Category } from "components/Notifications/Category"

export const NotificationsPage: MainStackScreen<"Notifications"> = () => {
  const [toggled, setToggled] = useState<boolean>(true)
  const categories = [
    {
      // icon:
      title: "Comunicazioni istituzionali",
      notifications: 2, // TODO: get the real number
      onPress: () => console.log("comunicazioni istituzionali!"),
    },
    {
      // icon:
      title: "Associazioni",
      notifications: 3, // TODO: get the real number
      onPress: () => console.log("associazioni!"),
    },
    {
      // icon:
      title: "Nuovi Upload",
      notifications: 0, // TODO: get the real number
      onPress: () => console.log("nuovi upload"),
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
          {categories.map((c, i) => {
            return (
              <Category
                title={c.title}
                switchControl={{
                  toggled: toggled,
                  onToggle: value => setToggled(value),
                }}
                onClick={c.onPress}
                notifications={c.notifications}
                key={`__notification-category-${i}`}
              />
            )
          })}
        </View>
      </ContentWrapperScroll>
    </View>
  )
}
