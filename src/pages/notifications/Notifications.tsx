import { useState } from "react"
import { View } from "react-native"
import { MainStackScreen } from "navigation/NavigationTypes"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Category } from "components/Notifications/Category"

import upload from "assets/notifications/upload.svg"
import associazioni from "assets/notifications/associazioni.svg"
import comunicazioni from "assets/notifications/comunicazioni.svg"

export const NotificationsPage: MainStackScreen<"Notifications"> = () => {
  const [toggled, setToggled] = useState<boolean>(true)
  const categories = [
    {
      title: "Comunicazioni istituzionali",
      notifications: 2, // TODO: get the real number
      onPress: () => console.log("comunicazioni istituzionali!"),
      // icon: ???,   come passare 2 svg
      icon: comunicazioni,
    },
    {
      title: "Associazioni",
      notifications: 3, // TODO: get the real number
      onPress: () => console.log("associazioni!"),
      icon: associazioni,
    },
    {
      title: "Nuovi Upload",
      notifications: 0, // TODO: get the real number
      onPress: () => console.log("nuovi upload"),
      icon: upload,
    },
  ]

  return (
    <View style={{ flex: 1 }}>
      <ContentWrapperScroll title="">
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: 105,
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
                icon={c.icon}
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
