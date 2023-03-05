import { FC } from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Text } from "components/Text"
import { Switch } from "react-native-switch"
// import { IconProps } from "assets/settings"
import { usePalette } from "utils/colors"

export interface CategoryProps {
  // icon?: IconProps
  title: string
  switchControl?: {
    /** State of the switch */
    toggled: boolean
    /** Function fired when the state of the switch changes */
    onToggle: (value: boolean) => void
  }
  notifications?: number
  onClick?: () => void
}

export const Category: FC<CategoryProps> = props => {
  const { backgroundSecondary, palette, isLight } = usePalette()

  const notifications = props.notifications ?? 0

  return (
    <Pressable style={styles.container} onPress={props.onClick}>
      {notifications ? (
        <View style={styles.circle}>
          <Text>{props.notifications}</Text>
        </View>
      ) : undefined}
      <Text>{props.title}</Text>

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
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    top: "24%",
    marginTop: "8%",
    height: 132,
    backgroundColor: "#424967",
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
    left: "-2%",
    top: "-6%",
    backgroundColor: "#FFB544",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
  },
  switch: {
    position: "absolute",
    top: "12%",
    alignSelf: "center",
    right: "3%",
  },
})
