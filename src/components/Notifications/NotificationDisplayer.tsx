import { BodyText } from "components/Text"
import { useNavigation } from "navigation/NavigationTypes"
import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { NotificationTile } from "./NotificationTile"
import { NotificationStorage } from "notifications/NotificationTypes"

export interface NotificationDisplayerProps {
  notification: NotificationStorage
}

export const NotificationDisplayer: FC<NotificationDisplayerProps> = props => {
  const { palette, isLight } = usePalette()

  const content = props.notification.content.data?.content

  const navigation = useNavigation()

  return (
    <View style={{ marginTop: 19, paddingBottom: 40 }}>
      <View>
        <NotificationTile
          notification={props.notification}
          overrideDividerBehaviour={true}
          showRipple={false}
          isRead={true}
          onCancel={() => navigation.goBack()}
        />
        <BodyText
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: isLight ? palette.variant3 : "#fff",
            textAlign: "justify",
            paddingHorizontal: 56,
          }}
        >
          {content}
        </BodyText>

        <View style={{ width: 56 }} />
      </View>
    </View>
  )
}
