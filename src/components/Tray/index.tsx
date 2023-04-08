import { useNavigationState } from "@react-navigation/native"
import React, { FC, useEffect } from "react"
import { Dimensions, Pressable, View } from "react-native"
import { newsSheetEventEmitter } from "utils/events"
import { LittleTitle } from "./LittleTitle"
import { TrayButton } from "./TrayButton"
import { useNotificationBadge } from "notifications/useNotificationBadge"
import { NotificationCentre } from "notifications/NotificationCentre"
import { BodyText } from "components/Text"
import * as Notifications from "expo-notifications"

const notificationCentre = NotificationCentre.getInstance()

/**
 * Top bar menu present in every page of the application, containing the
 * download, notifications and settings buttons.
 */
export const Tray: FC<{
  onDownloads: () => void
  onNotifications: () => void
  onSettings: () => void
}> = props => {
  const notInHome = useNavigationState(
    state =>
      state.index === 0 &&
      !!state.routes[0].state &&
      state.routes[0].state?.index !== 0
  )

  const [newsOpen, setNewsOpen] = React.useState(false)
  useEffect(() => {
    const listener = newsSheetEventEmitter.addListener(
      "state_change",
      (state: boolean) => setNewsOpen(state)
    )
    return () => {
      listener.remove?.()
    }
  }, [])

  const badge = useNotificationBadge()

  return (
    <View
      style={{
        position: "absolute",
        paddingHorizontal: 5,
        marginTop: 61,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        width: Dimensions.get("window").width,
      }}
    >
      <LittleTitle titleInCorner={notInHome || newsOpen} />
      <Pressable
        style={{
          height: 20,
          backgroundColor: "blue",
          marginRight: 10,
        }}
        onPress={async () => {
          await Notifications.scheduleNotificationAsync({
            content: { title: "prova", body: "Prova", data: {} },
            trigger: null,
          })
        }}
      >
        <BodyText>Notif</BodyText>
      </Pressable>
      <Pressable
        style={{
          height: 20,
          backgroundColor: "red",
          marginRight: 10,
        }}
        onPress={() => {
          notificationCentre.clearStorage()
        }}
      >
        <BodyText>Clear</BodyText>
      </Pressable>
      <TrayButton label="downloads" onClick={() => props.onDownloads()} />
      <TrayButton
        label="notifications"
        onClick={() => props.onNotifications()}
        style={{ marginTop: 1 }}
        badgeCount={badge}
      />
      <TrayButton label="settings" onClick={() => props.onSettings()} />
    </View>
  )
}
