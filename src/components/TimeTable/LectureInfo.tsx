import { BottomSheetScrollView } from "@gorhom/bottom-sheet"
import { BodyText, Title } from "components/Text"
import { FC, useContext, useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Event } from "api/collections/event"
import { usePalette } from "utils/colors"
import {
  TimetableDeducer,
  getLectureRoomFormattedString,
  getTimeIntervalFormattedString,
} from "utils/timetable"
import { ColorPickerLecture } from "./ColorPickerLecture"
import { useApiCall } from "api/useApiCall"
import { api } from "api"
import { LoginContext } from "contexts/login"
import { capitalize } from "utils/functions"
import { RemoteLinkButton } from "./RemoteLinkButton"

interface LectureInfoProps {
  lectureEvent: Event
  deducer: TimetableDeducer | undefined
}

/**
 * Layout component for the lecture info description inside bottom sheet.
 */
export const LectureInfo: FC<LectureInfoProps> = props => {
  const { iconHighContrast } = usePalette()

  const { loggedIn, userInfo } = useContext(LoginContext)

  const { matricola } = userInfo?.careers?.[0] ?? {}

  const [lecture] = useApiCall(
    api.events.getLectureDetails,
    {
      matricola: matricola ?? "",
      eventId: props.lectureEvent.event_id,
    },
    [props.lectureEvent.event_id, matricola, loggedIn]
  )

  const [updatedColor, setUpdatedColor] = useState(
    props.lectureEvent.lectureColor
  )

  const styles = useMemo(
    () =>
      StyleSheet.create({
        bolder: {
          fontWeight: "700",
          color: iconHighContrast,
        },
        lighter: {
          fontSize: 12,
          color: iconHighContrast,
        },
      }),
    [iconHighContrast]
  )

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        marginHorizontal: 36,
        marginBottom: 100,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Title style={{ fontSize: 20 }}>{props.lectureEvent.title.it}</Title>
          <BodyText style={styles.bolder}>
            {`(Docente: ${capitalize(lecture?.lecturer ?? "") || "..."})`}
          </BodyText>
        </View>
        <ColorPickerLecture
          color={updatedColor}
          onPress={() => {
            const color = props.deducer?.changeColor(
              props.lectureEvent.title.it
            )

            setUpdatedColor(color ?? props.lectureEvent.lectureColor)
          }}
        />
      </View>
      <View
        style={{
          marginTop: 32,
        }}
      >
        <BodyText style={styles.bolder}>
          {getTimeIntervalFormattedString(
            props.lectureEvent.date_start,
            props.lectureEvent.date_end
          )}
        </BodyText>
        <BodyText style={styles.bolder}>
          {getLectureRoomFormattedString(props.lectureEvent.room?.acronym_dn)}
        </BodyText>
        <BodyText style={styles.lighter}>
          {`(${
            lecture?.room.campus.split(" - ").splice(1).join(" - ") ?? "..."
          } - ${lecture?.room.building ?? "..."} - Piano ${
            lecture?.room.floor ?? "..."
          })`}
        </BodyText>

        {lecture?.remote_links.map((link, index) => (
          <RemoteLinkButton
            key={`__remote_link_btn${index}`}
            remoteLink={link}
          />
        ))}
      </View>
    </BottomSheetScrollView>
  )
}
