import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { NotificationStorage } from "utils/notifications"
import { NotificationTile } from "./NotificationTile"

export interface NotificationDisplayerProps {
  notification: NotificationStorage
}

export const NotificationDisplayer: FC<NotificationDisplayerProps> = props => {
  const { palette, isLight } = usePalette()

  const content = props.notification.notification.content.data.content
  return (
    <View style={{ marginTop: 19, paddingBottom: 40 }}>
      <View>
        <NotificationTile
          notification={props.notification}
          overrideDividerBehaviour={true}
          showRipple={false}
        />
        <BodyText
          style={{
            fontSize: 12,
            fontWeight: "400",
            color: isLight ? palette.purpleVariant : "#fff",
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
