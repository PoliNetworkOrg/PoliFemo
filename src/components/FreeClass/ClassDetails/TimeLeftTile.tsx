import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import clock from "assets/freeClassrooms/clock.svg"
import { extractTimeLeft, getStartEndDate } from "utils/rooms"
import { Occupancies } from "api/rooms"
import { Icon } from "components/Icon"
import { useTranslation } from "react-i18next"

interface TimeLeftTileProps {
  startDate: string
  occupancies: Occupancies
}

export const TimeLeftTile: FC<TimeLeftTileProps> = props => {
  const { isLight, labelsHighContrast, iconHighContrast, primary } =
    usePalette()

  const now = new Date()

  const searchDate = new Date(props.startDate)

  const { startDate, endDate } = getStartEndDate(searchDate, props.occupancies)

  const startHour = startDate?.getHours().toString().padStart(2, "0")
  const startMinutes = startDate?.getMinutes().toString().padStart(2, "0")

  const endhour = endDate?.getHours().toString().padStart(2, "0") ?? undefined
  const endMinutes =
    endDate?.getMinutes().toString().padStart(2, "0") ?? undefined

  const { hoursLeft, minutesLeft } = extractTimeLeft(now, endDate)

  const { t } = useTranslation()

  return (
    <View style={{ marginTop: 14 }}>
      <BodyText
        style={{
          fontSize: 20,
          fontWeight: "900",
          color: labelsHighContrast,
        }}
      >
        {t("freeClass_free", { ns: "freeClass" })}:
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
                width:
                  t("freeClass_from", { ns: "freeClass" }).length <= 2
                    ? 100
                    : 110,
              }}
            >
              <BodyText
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  color: labelsHighContrast,
                  flex: 1,
                  paddingRight:
                    t("freeClass_from", { ns: "freeClass" }).length <= 2
                      ? 12
                      : 0,
                }}
              >
                {t("freeClass_from", { ns: "freeClass" })}
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
                {t("freeClass_to", { ns: "freeClass" })}
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
            <View
              style={{
                width: 42,
                height: 49,
                marginLeft: 12,
                marginRight: 16,
              }}
            >
              <Icon source={clock} color={isLight ? primary : "#fff"} />
            </View>
            <View>
              <BodyText
                style={{
                  fontSize: 14,
                  fontWeight: "300",
                  color: labelsHighContrast,
                }}
              >
                {t("freeClass_timeRemaining", { ns: "freeClass" })}:
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
