import { FC } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Text } from "components/Text"
import { Switch } from "react-native-switch"
import { usePalette } from "utils/colors"

import { Icon } from "components/Icon"
import { useNotificationBadge, ValidCategoryId } from "utils/notifications"

export interface CategoryProps {
  title: string
  categoryId: ValidCategoryId
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
  const { backgroundSecondary, palette, isLight } = usePalette()

  const badgeCount = useNotificationBadge(props.categoryId)

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
        <Switch
          value={props.switchControl?.toggled}
          onValueChange={value => {
            props.switchControl?.onToggle(value)
          }}
          changeValueImmediately={true}
          renderActiveText={false}
          renderInActiveText={false}
          barHeight={27}
          switchWidthMultiplier={3}
          circleSize={18}
          circleActiveColor={backgroundSecondary}
          circleInActiveColor={palette.accent}
          circleBorderWidth={0}
          innerCircleStyle={{
            borderWidth: 1,
            borderColor: !props.switchControl?.toggled
              ? palette.accent
              : isLight
              ? "#EBEBEB"
              : "#3A4257",
          }}
          backgroundActive={palette.accent}
          backgroundInactive={"#FFF"}
          containerStyle={{
            borderWidth: 1,
            borderColor: palette.accent,
          }}
          switchLeftPx={1.5}
          switchRightPx={1.3}
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
