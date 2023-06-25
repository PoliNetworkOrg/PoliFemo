import { FC } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"

import { Icon } from "components/Icon"
import { ValidChannelId } from "notifications/NotificationTypes"
import { useNotificationBadge } from "notifications/useNotificationBadge"
import { ToggleSwitch } from "components/ToggleSwitch"

export interface CategoryProps {
  title: string
  channelId: ValidChannelId
  icon?: number
  switchControl?: {
    /** State of the switch */
    toggled: boolean
    /** Function fired when the state of the switch changes */
    onToggle: (value: boolean) => void
  }

  onClick?: () => void
}

export const Category: FC<CategoryProps> = props => {
  const { palette } = usePalette()

  const badgeCount = useNotificationBadge(props.channelId)

  return (
    <Pressable
      style={[{ backgroundColor: palette.primary }, styles.container]}
      onPress={props.onClick}
    >
      {badgeCount ? (
        <View style={[{ backgroundColor: palette.accent }, styles.circle]}>
          <Text
            style={{ color: palette.variant1, fontWeight: "900", fontSize: 20 }}
          >
            {badgeCount}
          </Text>
        </View>
      ) : undefined}

      <View style={styles.switch}>
        <ToggleSwitch
          value={props.switchControl?.toggled ?? false}
          onValueChange={value => {
            props.switchControl?.onToggle(value)
          }}
          color={palette.accent}
          overrideUnselectedBackground={palette.primary}
        />
      </View>
      <View style={{ marginBottom: 12 }}>
        {props.icon ? <Icon source={props.icon} /> : null}
      </View>
      <Text>{props.title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 18,
    marginTop: 35,
    height: 132,
    borderRadius: 12,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 12,
  },
  circle: {
    position: "absolute",
    height: 32,
    width: 32,
    left: -5,
    top: -8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  switch: {
    position: "absolute",
    top: 19,
    alignSelf: "center",
    right: 22,
  },
})
