import { FC, useEffect, useMemo, useState } from "react"
import { TouchableOpacity, View, ViewStyle } from "react-native"
import { DayProps } from "react-native-calendars/src/calendar/day"
import { Text } from "components/Text"
import { Canvas, Path, Skia } from "@shopify/react-native-skia"
import { DateData } from "react-native-calendars"
import { palette } from "utils/colors"

export const DayComponentCustom: FC<
  DayProps & { date?: DateData; height: number; dark?: boolean }
> = ({
  theme,
  marking,
  date,
  onPress,
  onLongPress,
  state,
  children,
  height,
  dark,
}) => {
  const [isMarked, setIsMarked] = useState(marking?.marked ?? false)

  const start = marking?.startingDay ?? false
  const end = marking?.endingDay ?? false
  const color = marking?.color ?? "transparent"

  useEffect(() => {
    // console.log("marked changed")
    setIsMarked(marking?.marked ?? false)
  }, [marking?.marked])

  const fillerStyles = useMemo(() => {
    const leftFillerStyle: ViewStyle = { flex: 1 }
    const rightFillerStyle: ViewStyle = { flex: 1 }
    let globalfiller: ViewStyle = {}

    if (start && !end) {
      rightFillerStyle.borderBottomColor = color
      rightFillerStyle.borderBottomWidth = 2
      rightFillerStyle.borderTopColor = color
      rightFillerStyle.borderTopWidth = 2
    } else if (end && !start) {
      leftFillerStyle.borderBottomColor = color
      leftFillerStyle.borderBottomWidth = 2
      leftFillerStyle.borderTopColor = color
      leftFillerStyle.borderTopWidth = 2
    } else if (color && !start && !end) {
      globalfiller = {
        borderBottomColor: color,
        borderBottomWidth: 2,
        borderTopColor: color,
        borderTopWidth: 2,
      }
    }
    return { leftFillerStyle, rightFillerStyle, globalfiller }
  }, [start, end, color])

  const path = useMemo(() => {
    let startAngle: number | undefined
    let sweepAngle: number | undefined

    if ((start && end) || state == "today") {
      startAngle = 90
      sweepAngle = 360
    } else if (start) {
      startAngle = 90
      sweepAngle = 180
    } else if (end) {
      startAngle = 270
      sweepAngle = 180
    } else {
      return undefined
    }

    const path = Skia.Path.Make()
    // path.moveTo(18, 1)
    //this looks kinda random
    path.addArc(
      { height: height - 2, width: height - 2, y: 1, x: 1 },
      startAngle,
      sweepAngle
    )

    return path
  }, [start, end, state])

  return (
    <TouchableOpacity
      style={{ alignSelf: "stretch" }}
      onPress={() => onPress?.(date)}
      onLongPress={() => onLongPress?.(date)}
    >
      <View style={{ alignItems: "center", alignSelf: "stretch" }}>
        <View
          style={[
            {
              position: "absolute",
              height: height,
              flexDirection: "row",
              left: 0,
              right: 0,
            },
            fillerStyles.globalfiller,
          ]}
        >
          <View style={fillerStyles.leftFillerStyle} />
          <View style={fillerStyles.rightFillerStyle} />
        </View>
        {path && (
          <Canvas
            style={{
              width: height,
              height: height,
              position: "absolute",
              zIndex: 5,
            }}
          >
            <Path
              path={path}
              color={
                state !== "today" ? color : dark ? palette.primary : "#fff"
              }
              strokeWidth={2}
              style="stroke"
            />
          </Canvas>
        )}
        <View
          style={{
            borderRadius: 17,
            width: height,
            height: height,
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 1.5,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "900",
              color: dark ? palette.primary : "#fff",
            }}
            allowFontScaling={false}
          >
            {String(children)}
          </Text>
          {isMarked && (
            <View
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                backgroundColor: theme?.dotColor,
                width: 5,
                height: 5,
                borderRadius: 100,
              }}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}
