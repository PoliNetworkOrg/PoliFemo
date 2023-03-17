import { Divider } from "components/Divider"
import { BodyText, HyperLink } from "components/Text"
import { TouchableRipple } from "components/TouchableRipple"
import { FC } from "react"
import { View, Image } from "react-native"
import { SharedElement } from "react-navigation-shared-element"
import { usePalette } from "utils/colors"
import { NotificationStorage } from "utils/notifications"

export interface NotificationTileProps {
  notification: NotificationStorage
  overrideDividerBehaviour?: boolean
  showRipple?: boolean
  onPress?: () => void
}

export const NotificationTile: FC<NotificationTileProps> = props => {
  const { palette, isLight } = usePalette()

  const sender = props.notification.notification.content.data.sender
  const association = props.notification.notification.content.data.association
  const object = props.notification.notification.content.data.object

  const linkUrl = props.notification.notification.content.data.linkUrl

  return (
    <TouchableRipple onClick={props.onPress} showRipple={props.showRipple}>
      <SharedElement id={props.notification.notification.identifier}>
        <View style={{ paddingVertical: 10, paddingHorizontal: 28 }}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
            }}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1560174038-da43ac74f01b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2057&q=80",
              }}
              style={{
                width: 48,
                height: 48,
                resizeMode: "cover",

                borderRadius: 24,
              }}
            />
            <View
              style={{
                marginLeft: 8,
                flex: 1,
                justifyContent: "space-around",
              }}
            >
              <BodyText
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: isLight ? palette.purpleVariant : "#fff",
                }}
              >
                {sender}
                {association ? ` - ${association}` : ""}
              </BodyText>
              <BodyText
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: isLight ? palette.purpleVariant : "#fff",
                }}
              >
                {object}
              </BodyText>
            </View>
          </View>
          {linkUrl && (
            <View style={{ marginLeft: 56 }}>
              <HyperLink
                href={linkUrl}
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: isLight ? palette.purpleVariant : "#fff",
                }}
              >
                collegamento a dove è stato caricato
              </HyperLink>
            </View>
          )}
        </View>
      </SharedElement>
      {!props.overrideDividerBehaviour ? (
        <View style={{ marginHorizontal: 28 }}>
          <Divider />
        </View>
      ) : undefined}
    </TouchableRipple>
  )
}
