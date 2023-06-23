import { FC } from "react"
import { Switch } from "react-native-switch"
import { usePalette } from "utils/colors"

export interface ToggleSwitchProps {
  /**
   * Whether the switch is on or off.
   */
  value: boolean
  /**
   * Callback fucntion for when the switch is toggled.
   * @param value whether the switch is on or off
   */
  onValueChange: (value: boolean) => void
  /**
   * Accent color of the switch, defaults to palette.accent. Changes border color,
   * inner circle color and active background color.
   * @default palette.accent
   */
  color?: string
  /**
   * Background color of the switch when it's off, defaults to theme background.
   */
  overrideUnselectedBackground?: string
}

const CIRCLE_SIZE = 18.44
const SWITCH_WIDTH = 52
const BAR_HEIGHT = 27

/**
 * A toggle switch component, with a circle that slides on a bar.
 * Colors can be changed programmatically and style is consistent.
 */
export const ToggleSwitch: FC<ToggleSwitchProps> = props => {
  const { background, backgroundSecondary, palette, isLight } = usePalette()

  const color = props.color ?? palette.accent

  return (
    <Switch
      value={props.value}
      onValueChange={props.onValueChange}
      changeValueImmediately
      renderActiveText={false}
      renderInActiveText={false}
      barHeight={BAR_HEIGHT}
      switchWidthMultiplier={SWITCH_WIDTH / CIRCLE_SIZE}
      circleSize={CIRCLE_SIZE}
      circleActiveColor={backgroundSecondary}
      circleInActiveColor={color}
      circleBorderWidth={0}
      innerCircleStyle={{
        borderWidth: 1,
        borderColor: !props.value ? color : isLight ? "#EBEBEB" : "#3A4257",
      }}
      backgroundActive={color}
      backgroundInactive={props.overrideUnselectedBackground ?? background}
      containerStyle={{
        borderWidth: 1,
        borderColor: color,
      }}
      // the math is weird, this is the multiplier for the switch width of how
      // much the circle is offset from the center
      // this is what it comes out to be, the -2 is bc of the added border width
      switchLeftPx={(2 * CIRCLE_SIZE) / (SWITCH_WIDTH - BAR_HEIGHT - 2)}
      switchRightPx={(2 * CIRCLE_SIZE) / (SWITCH_WIDTH - BAR_HEIGHT)}
    />
  )
}
