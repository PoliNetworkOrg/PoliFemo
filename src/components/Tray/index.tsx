import { useNavigationState } from "@react-navigation/native"
import React, { FC, useEffect } from "react"
import { Dimensions, Pressable, View } from "react-native"
import { newsSheetEventEmitter } from "utils/events"
import { notificationsTestingUtils } from "utils/notifications"
import { LittleTitle } from "./LittleTitle"
import { TrayButton } from "./TrayButton"

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
          width: 20,
          height: 20,
          backgroundColor: "red",
          marginRight: 15,
        }}
        onPress={async () => {
          console.log("logging current permission: ")
          await notificationsTestingUtils.logPermission()

          const granted = await notificationsTestingUtils.askPermission()
          console.log("granted: " + granted)

          console.log("logging new permission: ")
          await notificationsTestingUtils.logPermission()
        }}
      />
      {/* <Pressable
        style={{
          width: 20,
          height: 20,
          backgroundColor: "green",
          marginRight: 15,
        }}
        onPress={async () => {
          void console.log(await getAllNotificationsFromStorage())
        }}
      /> */}
      {/* <Pressable
        style={{
          width: 20,
          height: 20,
          backgroundColor: "yellow",
          marginRight: 15,
        }}
        onPress={() => {
          void AsyncStorage.removeItem("notifications")
        }}
      /> */}
      <TrayButton label="downloads" onClick={() => props.onDownloads()} />
      <TrayButton
        label="notifications"
        onClick={() => props.onNotifications()}
        style={{ marginTop: 1 }}
      />
      <TrayButton label="settings" onClick={() => props.onSettings()} />
    </View>
  )
}
