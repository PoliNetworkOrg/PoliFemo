import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Category } from "components/Notifications/Category"
import { Title } from "components/Text"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View } from "react-native"
import associazioni from "assets/notifications/associazioni.svg"
import comunicazioni from "assets/notifications/comunicazioni.svg"
import upload from "assets/notifications/upload.svg"
import { useNotificationsChannels } from "notifications/useActiveChannels"
import { NotificationCentre } from "notifications/NotificationCentre"
import { getNewChannelsStatuses } from "utils/notifications"

const notificationCentre = NotificationCentre.getInstance()

export const Notifications: MainStackScreen<"Notifications"> = () => {
  const { navigate } = useNavigation()

  const { activeChannels, setActiveChannels } = useNotificationsChannels()

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
            switchControl={{
              toggled: activeChannels?.comunicazioni ?? true,

              onToggle: val => {
                const newChannels = getNewChannelsStatuses(
                  activeChannels,
                  "comunicazioni",
                  val
                )

                setActiveChannels({ ...newChannels })
                notificationCentre.updateNotificationsChannels(newChannels, val)
              },
            }}
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
            switchControl={{
              toggled: activeChannels?.associazioni ?? true,
              onToggle: val => {
                const newChannels = getNewChannelsStatuses(
                  activeChannels,
                  "associazioni",
                  val
                )
                setActiveChannels({ ...newChannels })
                notificationCentre.updateNotificationsChannels(newChannels, val)
              },
            }}
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
            switchControl={{
              toggled: activeChannels?.upload ?? true,
              onToggle: val => {
                const newChannels = getNewChannelsStatuses(
                  activeChannels,
                  "upload",
                  val
                )
                setActiveChannels({ ...newChannels })
                notificationCentre.updateNotificationsChannels(newChannels, val)
              },
            }}
          />
        </View>
      </View>
    </ContentWrapperScroll>
  )
}
