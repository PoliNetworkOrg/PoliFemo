import { FC, useMemo } from "react"
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
import { extractTimeLeft, getStartEndDate } from "utils/rooms"
import { Occupancies } from "api/rooms"

interface TimeLeftTileProps {
  startDate: string
  occupancies: Occupancies
}

export const TimeLeftTile: FC<TimeLeftTileProps> = props => {
  const { isLight, labelsHighContrast, iconHighContrast, primary } =
    usePalette()

  const clockSvg = useSVG(clock)

  const paint = useMemo(() => Skia.Paint(), [])
  paint.setColorFilter(
    Skia.ColorFilter.MakeBlend(Skia.Color(labelsHighContrast), BlendMode.SrcIn)
  )
  const paintClock = useMemo(() => Skia.Paint(), [])
  paintClock.setColorFilter(
    Skia.ColorFilter.MakeBlend(
      Skia.Color(isLight ? primary : "#fff"),
      BlendMode.SrcIn
    )
  )

  const now = new Date()

  const searchDate = new Date(props.startDate)

  const { startDate, endDate } = getStartEndDate(searchDate, props.occupancies)

  const startHour = startDate?.getHours().toString().padStart(2, "0")
  const startMinutes = startDate?.getMinutes().toString().padStart(2, "0")

  const endhour = endDate?.getHours().toString().padStart(2, "0") ?? undefined
  const endMinutes =
    endDate?.getMinutes().toString().padStart(2, "0") ?? undefined

  const { hoursLeft, minutesLeft } = extractTimeLeft(now, endDate)

  return (
    <View style={{ marginTop: 14 }}>
      <BodyText
        style={{
          fontSize: 20,
          fontWeight: "900",
          color: labelsHighContrast,
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
                  color: labelsHighContrast,
                  flex: 1,
                  paddingRight: 12,
                }}
              >
                Da
              </BodyText>
              <View
                style={{
                  borderColor: iconHighContrast,
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
                    color: labelsHighContrast,
                    paddingHorizontal: 2,
                  }}
                >
                  {startHour && startMinutes
                    ? `${startHour} : ${startMinutes}`
                    : "-- : --"}
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
                  color: labelsHighContrast,
                  paddingRight: 12,
                  flex: 1,
                  textAlign: "right",
                }}
              >
                A
              </BodyText>
              <View
                style={{
                  borderColor: iconHighContrast,
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
                    color: labelsHighContrast,
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
              borderColor: iconHighContrast,
              borderWidth: 0.5,
              flexDirection: "row",
              borderRadius: 5,
              paddingRight: 12,
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
                  color: labelsHighContrast,
                }}
              >
                Mancano:
              </BodyText>
              <BodyText
                style={{
                  fontSize: 36,
                  fontWeight: "700",
                  color: labelsHighContrast,
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
