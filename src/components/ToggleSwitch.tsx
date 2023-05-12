import { FC } from "react"
import { Switch } from "react-native-switch"
import { usePalette } from "utils/colors"

export interface ToggleSwitchProps {
  value: boolean
  onValueChange: (value: boolean) => void
  color?: string
}

const CIRCLE_SIZE = 18.44
const SWITCH_WIDTH = 52
const BAR_HEIGHT = 27

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
      backgroundInactive={background}
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
