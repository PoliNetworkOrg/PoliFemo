import { FC, memo, useMemo } from "react"
import { TouchableOpacity, View } from "react-native"
import { DayProps } from "react-native-calendars/src/calendar/day"
import { Text } from "components/Text"
import { Canvas, Path, Skia } from "@shopify/react-native-skia"
import { DateData } from "react-native-calendars"
import { palette } from "utils/colors"

const height = 30

export const DayComponentCustom: FC<DayProps & { date?: DateData }> = memo(
  function dayComponent({
    theme,
    marking,
    date,
    onPress,
    onLongPress,
    state,
    children,
  }) {
    const isToday = state === "today"
    const isSelected = marking?.selected ?? false
    const isInsidePeriod = marking?.color !== undefined // if inside period, color is defined
    const start = marking?.startingDay ?? false
    const end = marking?.endingDay ?? false
    const color = marking?.color ?? "transparent"

    const path = useMemo(() => {
      const path = Skia.Path.Make()
      if ((start && end) || isToday || !isInsidePeriod) {
        // still a circle if today or not inside period
        path.addArc({ height, width: height, y: 0, x: height * 1.5 }, 90, 360)
      } else if (start) {
        // only start, draw half circle
        path.addRect({ height, width: height * 2, y: 0, x: height * 2 })
        path.addArc({ height, width: height, y: 0, x: height * 1.5 }, 90, 180)
      } else if (end) {
        // only end, draw half circle
        path.addRect({ height, width: height * 2, y: 0, x: 0 })
        path.addArc({ height, width: height, y: 0, x: height * 1.5 }, 270, 180)
      } else {
        // inside period, draw rectangle
        path.addRect({ height, width: height * 4, y: 0, x: 0 })
      }
      return path
    }, [start, end, isToday, isInsidePeriod])

    return (
      <TouchableOpacity
        style={{ alignSelf: "stretch", alignItems: "center" }}
        onPress={() => onPress?.(date)}
        onLongPress={() => onLongPress?.(date)}
      >
        <View
          style={{
            alignItems: "center",
            alignSelf: "stretch",
            overflow: "hidden",
            marginTop: 8,
          }}
        >
          <Canvas
            style={{
              width: height * 4, // just to be sure, doesn't matter
              height: height,
              position: "absolute",
            }}
          >
            <Path
              path={path}
              color={isSelected ? "#fff" : color}
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
                fontSize: 16,
                fontWeight: "500",
                color: isToday
                  ? palette.accent
                  : isSelected
                  ? palette.primary
                  : "#fff",
              }}
              allowFontScaling={false}
            >
              {String(children)}
            </Text>
          </View>
        </View>
        {marking?.marked && (
          <View
            style={{
              position: "absolute",
              bottom: -7,
              transform: [{ translateX: 2 / 3 }],
              backgroundColor: theme?.dotColor,
              width: 5,
              height: 5,
              borderRadius: 100,
            }}
          />
        )}
      </TouchableOpacity>
    )
  }
)
