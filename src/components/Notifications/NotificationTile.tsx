import { Divider } from "components/Divider"
import { Icon } from "components/Icon"
import { BodyText, HyperLink } from "components/Text"
import { TouchableRipple } from "components/TouchableRipple"
import { FC } from "react"
import { View, Image, Pressable } from "react-native"
import { SharedElement } from "react-navigation-shared-element"
import { usePalette } from "utils/colors"

import deleteSvg from "assets/menu/delete.svg"
import { NotificationStorage } from "notifications/NotificationTypes"
import { notificationEventEmitter } from "notifications/NotificationEventEmitter"
import { NotificationCenter } from "notifications/NotificationCenter"

/* import Swipeable from "react-native-gesture-handler/Swipeable" */

const notificationCenter = NotificationCenter.getInstance()

export interface NotificationTileProps {
  notification: NotificationStorage
  overrideDividerBehaviour?: boolean
  showRipple?: boolean
  isRead?: boolean
  onPress?: () => void
  onCancel?: () => void
}

export const NotificationTile: FC<NotificationTileProps> = props => {
  const { palette, isLight } = usePalette()

  const sender = props.notification.content.data?.sender
  const association = props.notification.content.data?.association
  const object = props.notification.content.data?.object
  const linkUrl = props.notification.content.data?.linkUrl
  const identifier = props.notification.identifier
  const isRead = props.isRead ?? props.notification.isRead

  return (
    /* <Swipeable
      enabled={true}
      renderRightActions={() => {
        return (
          <View
            style={{
              backgroundColor: "red",
              width: "100%",
              marginVertical: 1,
            }}
          />
        )
      }}
    > */
    <TouchableRipple onClick={props.onPress} showRipple={props.showRipple}>
      <SharedElement id={props.notification.identifier}>
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 28,
            backgroundColor: isLight ? "#fff" : palette.darker,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              flex: 1,
            }}
          >
            <Image
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              source={require("../../../assets/polimi_placeholder.jpg")}
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
                  color: isLight ? palette.variant3 : "#fff",
                }}
              >
                {sender}
                {association ? ` - ${association}` : ""}
              </BodyText>
              <BodyText
                style={{
                  fontSize: 12,
                  fontWeight: "700",
                  color: isLight ? palette.variant3 : "#fff",
                }}
              >
                {object}
              </BodyText>
            </View>
            <View
              style={{
                justifyContent: "space-between",
              }}
            >
              <Pressable
                onPress={() => {
                  notificationCenter.removeNotificationFromStorage(identifier)
                  if (!isRead) {
                    notificationEventEmitter.emit("badge-change")
                  }
                  if (props.onCancel) {
                    props.onCancel()
                  }
                }}
              >
                <Icon source={deleteSvg} style={{ alignSelf: "flex-end" }} />
              </Pressable>
              {!isRead && (
                <BodyText
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: isLight ? palette.variant3 : "#fff",
                  }}
                >
                  New!!
                </BodyText>
              )}
            </View>
          </View>
          {linkUrl && (
            <View style={{ marginLeft: 56 }}>
              <HyperLink
                href={linkUrl}
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: isLight ? palette.variant3 : "#fff",
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
    /* </Swipeable> */
  )
}
