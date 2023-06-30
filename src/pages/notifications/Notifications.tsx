import { Category } from "components/Notifications/Category"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import associazioni from "assets/notifications/associazioni.svg"
import comunicazioni from "assets/notifications/comunicazioni.svg"
import upload from "assets/notifications/upload.svg"
import { useNotificationsChannels } from "notifications/useActiveChannels"
import { NotificationCenter } from "notifications/NotificationCenter"
import { getNewChannelsStatuses } from "utils/notifications"
import { useTranslation } from "react-i18next"
import { ScrollPage } from "components/PageLayout"

const notificationCenter = NotificationCenter.getInstance()

export const Notifications: MainStackScreen<"Notifications"> = () => {
  const { navigate } = useNavigation()

  const { activeChannels, setActiveChannels } = useNotificationsChannels()

  const { t } = useTranslation("notifications")

  const categoryComunications = t("notifications_category_comunications")
  const categoryAssociations = t("notifications_category_associations")
  const categoryUploads = t("notifications_category_uploads")

  return (
    <ScrollPage title={t("notifications_title")}>
      <Category
        title={categoryComunications}
        channelId="comunicazioni"
        icon={comunicazioni}
        onClick={() =>
          navigate("NotificationsCategory", {
            category: categoryComunications,
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
            notificationCenter.updateNotificationsChannels(newChannels, val)
          },
        }}
      />
      <Category
        title={categoryAssociations}
        channelId="associazioni"
        icon={associazioni}
        onClick={() =>
          navigate("NotificationsCategory", {
            category: categoryAssociations,
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
            notificationCenter.updateNotificationsChannels(newChannels, val)
          },
        }}
      />
      <Category
        title={categoryUploads}
        channelId="upload"
        icon={upload}
        onClick={() =>
          navigate("NotificationsCategory", {
            category: categoryUploads,
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
            notificationCenter.updateNotificationsChannels(newChannels, val)
          },
        }}
      />
    </ScrollPage>
  )
}
