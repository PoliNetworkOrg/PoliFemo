import React, { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { NotificationsStack } from "navigation/NotificationsNavigator"

/**
 * The Notifications Container.
 *
 * It's a view that wraps pages of the Notifications Navigator
 */
export const NotificationsContainer: FC = () => {
  const { homeBackground } = usePalette()

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: homeBackground,
      }}
    >
      <NotificationsStack />
    </View>
  )
}
