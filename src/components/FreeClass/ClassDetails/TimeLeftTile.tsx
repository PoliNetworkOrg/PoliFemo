import React, { FC, useMemo } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"

import {
  BlendMode,
  Canvas,
  Group,
  ImageSVG,
  Skia,
  useSVG,
} from "@shopify/react-native-skia"
import clock from "assets/freeClassrooms/clock.svg"
import { extractTimeLeft, getEndDate } from "utils/rooms"

interface TimeLeftTileProps {
  startDate: string
  occupancies?: Record<string, "FREE" | "OCCUPIED">
}

export const TimeLeftTile: FC<TimeLeftTileProps> = props => {
  const { isLight } = usePalette()

  const clockSvg = useSVG(clock)

  const paint = useMemo(() => Skia.Paint(), [])
  paint.setColorFilter(
    Skia.ColorFilter.MakeBlend(
      Skia.Color(isLight ? "#414867" : "#fff"),
      BlendMode.SrcIn
    )
  )
  const paintClock = useMemo(() => Skia.Paint(), [])
  paintClock.setColorFilter(
    Skia.ColorFilter.MakeBlend(
      Skia.Color(isLight ? "#424967" : "#fff"),
      BlendMode.SrcIn
    )
  )

  const startDate = new Date(props.startDate)

  const endDate = getEndDate(startDate, props.occupancies)

  const startHour = startDate.getHours().toString().padStart(2, "0")
  const startMinutes = startDate.getMinutes().toString().padStart(2, "0")

  let endhour = endDate?.getHours().toString().padStart(2, "0") ?? undefined
  let endMinutes =
    endDate?.getMinutes().toString().padStart(2, "0") ?? undefined

  const { hoursLeft, minutesLeft } = extractTimeLeft(startDate, endDate)

  // ! temporary fix
  if (endDate && endDate.getTime() - startDate.getTime() < 0) {
    endhour = undefined
    endMinutes = undefined
  }
  return (
    <View style={{ marginTop: 14 }}>
      <BodyText
        style={{
          fontSize: 20,
          fontWeight: "900",
          color: isLight ? "#414867" : "#fff",
        }}
      >
        Libera:
      </BodyText>
      <View
        style={{
          flexDirection: "row",
          marginTop: 18,
          justifyContent: "space-between",
        }}
      >
        <View>
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
                width: 100,
              }}
            >
              <BodyText
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: isLight ? "#414867" : "#fff",
                  flex: 1,
                  paddingRight: 12,
                }}
              >
                Da
              </BodyText>
              <View
                style={{
                  borderColor: isLight ? "#454773" : "#fff",
                  borderWidth: 0.5,
                  borderRadius: 5,
                  minWidth: 70,
                  alignItems: "center",
                }}
              >
                <BodyText
                  style={{
                    fontSize: 20,
                    fontWeight: "400",
                    color: isLight ? "#414867" : "#fff",
                    paddingHorizontal: 2,
                  }}
                >
                  {startHour} : {startMinutes}
                </BodyText>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <BodyText
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: isLight ? "#414867" : "#fff",
                  paddingRight: 12,
                  flex: 1,
                  textAlign: "right",
                }}
              >
                A
              </BodyText>
              <View
                style={{
                  borderColor: isLight ? "#454773" : "#fff",
                  borderWidth: 0.5,
                  borderRadius: 5,
                  minWidth: 70,
                  alignItems: "center",
                }}
              >
                <BodyText
                  style={{
                    fontSize: 20,
                    fontWeight: "400",
                    color: isLight ? "#414867" : "#fff",
                    paddingHorizontal: 2,
                  }}
                >
                  {endhour && endMinutes
                    ? `${endhour} : ${endMinutes}`
                    : "-- : --"}
                </BodyText>
              </View>
            </View>
          </View>
        </View>
        <View>
          <View
            style={{
              borderColor: isLight ? "#454773" : "#fff",
              borderWidth: 0.5,
              flexDirection: "row",
              borderRadius: 5,
              width: 200,
              height: 64,
              alignItems: "center",
            }}
          >
            {clock && clockSvg && (
              <View
                style={{
                  width: 42,
                  height: 49,
                  marginLeft: 12,
                  marginRight: 16,
                }}
              >
                <Canvas
                  style={{
                    flex: 1,
                    width: 42,
                    height: 49,
                  }}
                >
                  <Group layer={paintClock}>
                    <ImageSVG
                      svg={clockSvg}
                      x={0}
                      y={0}
                      width={42}
                      height={49}
                    />
                  </Group>
                </Canvas>
              </View>
            )}
            <View>
              <BodyText
                style={{
                  fontSize: 14,
                  fontWeight: "300",
                  color: isLight ? "#414867" : "#fff",
                }}
              >
                Mancano:
              </BodyText>
              <BodyText
                style={{
                  fontSize: 36,
                  fontWeight: "700",
                  color: isLight ? "#414867" : "#fff",
                }}
              >
                {hoursLeft && minutesLeft
                  ? `${hoursLeft} h ${minutesLeft}'`
                  : "-- h -- '"}
              </BodyText>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
