import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Category } from "components/Notifications/Category"
import { Title } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View } from "react-native"
import associazioni from "assets/notifications/associazioni.svg"
import comunicazioni from "assets/notifications/comunicazioni.svg"
import upload from "assets/notifications/upload.svg"

export const Notifications: MainStackScreen<"Notifications"> = () => {
  const { navigate } = useNavigation()

  return (
    <ContentWrapperScroll>
      <View>
        <Title style={{ paddingHorizontal: 28, paddingTop: 28 }}>
          Notifiche
        </Title>
        <View style={{ paddingTop: 20 }}>
          <Category
            title="Comunicazioni Istituzionali"
            channelId="comunicazioni"
            icon={comunicazioni}
            onClick={() =>
              navigate("NotificationsCategory", {
                category: "Comunicazioni Istituzionali",
                channelId: "comunicazioni",
              })
            }
          />
          <Category
            title="Associazioni"
            channelId="associazioni"
            icon={associazioni}
            onClick={() =>
              navigate("NotificationsCategory", {
                category: "Associazioni",
                channelId: "associazioni",
              })
            }
          />
          <Category
            title="Nuovi Upload"
            channelId="upload"
            icon={upload}
            onClick={() =>
              navigate("NotificationsCategory", {
                category: "Nuovi Upload",
                channelId: "upload",
              })
            }
          />
        </View>
      </View>
    </ContentWrapperScroll>
  )
}
