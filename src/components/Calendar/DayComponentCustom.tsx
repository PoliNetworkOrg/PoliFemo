import { FC, useEffect, useMemo, useState } from "react"
import { TouchableOpacity, View } from "react-native"
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

  const path = useMemo(() => {
    const path = Skia.Path.Make()
    if ((start && end) || state == "today") {
      path.addArc(
        { height: height, width: height, y: 0, x: height * 1.5 },
        90,
        360
      )
    } else if (start) {
      path.addRect({ height: height, width: height * 2, y: 0, x: height * 2 })
      path.addArc(
        { height: height, width: height, y: 0, x: height * 1.5 },
        90,
        180
      )
    } else if (end) {
      path.addRect({ height: height, width: height * 2, y: 0, x: 0 })
      path.addArc(
        { height: height, width: height, y: 0, x: height * 1.5 },
        270,
        180
      )
    } else {
      path.addRect({ height: height, width: height * 4, y: 0, x: 0 })
    }
    return path
  }, [start, end, state])

  return (
    <TouchableOpacity
      style={{ alignSelf: "stretch", overflow: "hidden" }}
      onPress={() => onPress?.(date)}
      onLongPress={() => onLongPress?.(date)}
    >
      <View style={{ alignItems: "center", alignSelf: "stretch" }}>
        <Canvas
          style={{
            width: height * 4, // just to be sure, doesn't matter
            height: height,
            position: "absolute",
          }}
        >
          <Path
            path={path}
            color={state !== "today" ? color : dark ? palette.primary : "#fff"}
            strokeWidth={2}
            style="fill"
          />
        </Canvas>
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
                // right: 0,
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
