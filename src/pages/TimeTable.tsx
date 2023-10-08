import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { Pressable, View } from "react-native"
import { TimeLine } from "components/TimeTable/TimeLine"
import { WeekLine } from "components/TimeTable/WeekLine"
import { ScrollView } from "react-native-gesture-handler"
import { Event } from "api/collections/event"
import { BodyText } from "components/Text"
import { getUsableScreenHeight } from "utils/layout"
import BottomSheet from "@gorhom/bottom-sheet"
import { TimeTableContext } from "contexts/timeTable"
import {
  FormattedTable,
  Subjects,
  TimetableDeducer,
  getFormattedTable,
  getMarginDays,
  getMarginDaysCollapsed,
} from "utils/timetable"
import { TimetableRow } from "components/TimeTable/TimetableRow"
import { LoginContext } from "contexts/login"
import { Grid } from "components/TimeTable/OverlayGrid"
import { usePalette } from "utils/colors"
import { useFocusEffect } from "@react-navigation/native"
import { TimetableBottomSheetHandle } from "components/TimeTable/TimetableBottomSheetHandle"
import { Modal } from "components/Modal"
import { Icon } from "components/Icon"
import list_timetable from "assets/timetable/list_timetable.svg"
import {
  Extrapolate,
  interpolate,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated"
import { LectureInfo } from "components/TimeTable/LectureInfo"
import { MainStackScreen } from "navigation/NavigationTypes"
import { PageWrap } from "components/PageLayout"
import { capitalize } from "utils/functions"
import { ToggleSwitch } from "components/ToggleSwitch"
import { useTranslation } from "react-i18next"
import { useCurrentLanguage } from "utils/language"

// distance of the bottom sheet from the top of the screen, when opened or closed
const distanceFromTop = {
  closed: 500,
  opened: 191,
}

export const TimeTable: MainStackScreen<"TimeTable"> = () => {
  const { t } = useTranslation("timetable")

  const lan = useCurrentLanguage()

  const { timeTableOpen, setTimeTableOpen } = useContext(TimeTableContext)

  const bottomSheetRef = useRef<BottomSheet>(null)

  const [currentLecture, setCurrentLecture] = useState<Event>()

  const { loggedIn, userInfo } = useContext(LoginContext)

  const { matricola } = userInfo?.careers?.[0] ?? {}

  const [formattedTable, setFormattedTimetable] = useState<FormattedTable>(
    getFormattedTable([])
  )

  const [subjects, setSubjects] = useState<Subjects>({})

  const [isModalShowing, setIsModalShowing] = useState(false)

  const [selectedLectureId, setSelectedLectureId] = useState<
    number | undefined
  >(undefined)

  const { isLight, palette, background } = usePalette()

  const deducer = useRef<TimetableDeducer | undefined>()

  useEffect(() => {
    const handleTimeTableEvent = () => {
      if (matricola && loggedIn && !deducer.current) {
        deducer.current = new TimetableDeducer(matricola)
        deducer.current.addListener("timetable_retrieved", () => {
          if (deducer?.current?.formattedTable) {
            setFormattedTimetable({ ...deducer?.current?.formattedTable })
          }
          if (deducer?.current?.subjects) {
            setSubjects(deducer?.current?.subjects)
          }
        })
      }
    }

    handleTimeTableEvent()

    return () => {
      deducer?.current?.removeListener(
        "timetable_retrieved",
        handleTimeTableEvent
      )
    }
  }, [matricola, loggedIn])

  useEffect(() => {
    if (timeTableOpen) {
      bottomSheetRef.current?.close?.()
      setSelectedLectureId(undefined)
    } else {
      bottomSheetRef.current?.snapToIndex(0)
    }
  }, [timeTableOpen])

  useFocusEffect(
    useCallback(() => {
      return () => bottomSheetRef.current?.close()
    }, [])
  )

  const animValue = useSharedValue(-1)
  const clipped = useDerivedValue(
    () =>
      interpolate(animValue.value, [-1, 0], [-1, 0], {
        extrapolateLeft: Extrapolate.CLAMP,
        extrapolateRight: Extrapolate.CLAMP,
      }),
    [animValue]
  )

  const updateSubjects = (newSubjects: Subjects) => {
    if (deducer.current) {
      deducer.current.updateSubjects(newSubjects)
    }
  }

  const margins: [number[], number[]] = useMemo(
    () => [
      getMarginDays(formattedTable),
      getMarginDaysCollapsed(formattedTable),
    ],
    [formattedTable]
  )

  return (
    <PageWrap
      title={t("title")}
      sideTitleElement={
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <Pressable onPress={() => setIsModalShowing(true)}>
            <Icon
              source={list_timetable}
              color={isLight ? palette.primary : undefined}
            />
          </Pressable>
        </View>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          <WeekLine
            animatedValue={clipped}
            overlapsNumberList={margins[0]}
            overlapsNumberListCollapsed={margins[1]}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{
              paddingLeft: 10,
            }}
          >
            <View>
              <TimeLine />
              <View style={{ height: "100%" }}>
                {Object.keys(formattedTable).map(day => {
                  const _day = day as keyof FormattedTable
                  return (
                    <TimetableRow
                      animatedValue={clipped}
                      onEventPress={(event: Event) => {
                        if (timeTableOpen) {
                          //set lecture and open bottom sheet
                          setTimeTableOpen(!timeTableOpen)
                          setCurrentLecture(event)
                          setSelectedLectureId(event.event_id)
                        } else if (
                          currentLecture?.event_id === event.event_id
                        ) {
                          //close bottom sheet if click on same lecture
                          setTimeTableOpen(!timeTableOpen)
                          setCurrentLecture(event)
                          setSelectedLectureId(event.event_id)
                        } else {
                          //set lecture and bottom sheet remains open
                          setCurrentLecture(event)
                          setSelectedLectureId(event.event_id)
                        }
                      }}
                      row={formattedTable[_day]}
                      selectedLectureId={selectedLectureId}
                      key={day}
                    />
                  )
                })}

                <Grid />
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      <BottomSheet
        ref={bottomSheetRef}
        handleComponent={TimetableBottomSheetHandle}
        index={-1}
        snapPoints={[
          getUsableScreenHeight() - distanceFromTop.closed,
          getUsableScreenHeight() - distanceFromTop.opened,
        ]}
        enablePanDownToClose={true}
        animatedIndex={animValue}
        onAnimate={(fromIndex, toIndex) => {
          // quicker callback
          if (toIndex === -1) setTimeTableOpen(true)
        }}
        onClose={() => setTimeTableOpen(true)}
        backgroundStyle={{
          backgroundColor: background,
          // Not 30 borderRadius because on IOS on dark mode there where white borders
          borderTopLeftRadius: 33,
          borderTopRightRadius: 33,
        }}
      >
        {currentLecture && (
          <LectureInfo
            lectureEvent={currentLecture}
            deducer={deducer.current}
          />
        )}
      </BottomSheet>

      <Modal
        isShowing={isModalShowing}
        title={t("modalTitle")}
        onClose={() => setIsModalShowing(false)}
        contentContainerStyle={{ paddingBottom: 16 }}
        centerText
      >
        <ScrollView
          style={{
            height: "100%",
            marginTop: 24,
          }}
          contentContainerStyle={{ paddingBottom: 8 }}
        >
          {Object.keys(subjects).map(subject => {
            const lectureName =
              lan === "it"
                ? capitalize(subject, 3)
                : capitalize(subjects[subject].en ?? subject, 3)
            return (
              <Pressable
                key={`__subject-selector-${subject}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 24,
                  paddingVertical: 6,
                }}
              >
                <BodyText
                  style={{
                    flexShrink: 1,
                    fontSize: 16,
                    fontWeight: "400",
                    marginRight: 8,
                  }}
                >
                  {lectureName}
                </BodyText>
                <ToggleSwitch
                  value={subjects[subject].isShowing}
                  color={subjects[subject].color}
                  onValueChange={newValue => {
                    const newSubjects = {
                      ...subjects,
                      [subject]: {
                        isShowing: newValue,
                        color: subjects[subject].color,
                        en: subjects[subject].en,
                      },
                    }
                    setSubjects(newSubjects)

                    //update storage
                    updateSubjects(newSubjects)
                  }}
                />
              </Pressable>
            )
          })}
        </ScrollView>
      </Modal>
    </PageWrap>
  )
}
