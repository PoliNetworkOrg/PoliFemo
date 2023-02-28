import { Divider } from "components/Divider"
import { BodyText, HyperLink } from "components/Text"
import { TouchableRipple } from "components/TouchableRipple"
import React, { FC } from "react"
import { View, Image } from "react-native"
import { usePalette } from "utils/colors"
import { NotificationData } from "."

export interface NotificationTileProps {
  notification: NotificationData
  overrideDividerBehaviour?: boolean
  showRipple?: boolean
  onPress?: () => void
}

export const NotificationTile: FC<NotificationTileProps> = props => {
  const { palette, isLight } = usePalette()
  return (
    <TouchableRipple onClick={props.onPress} showRipple={props.showRipple}>
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
              {props.notification.sender}
              {props.notification.association
                ? ` - ${props.notification.association}`
                : ""}
            </BodyText>
            <BodyText
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: isLight ? palette.purpleVariant : "#fff",
              }}
            >
              {props.notification.object}
            </BodyText>
          </View>
        </View>
        {props.notification.linkUrl && (
          <View style={{ marginLeft: 56 }}>
            <HyperLink
              href={props.notification.linkUrl}
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
      {!props.overrideDividerBehaviour ? (
        <View style={{ marginHorizontal: 28 }}>
          <Divider />
        </View>
      ) : undefined}
    </TouchableRipple>
  )
}
