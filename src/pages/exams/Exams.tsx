import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"

import { BodyText } from "components/Text"

import { ListPage } from "components/PageLayout"
import { useContext, useEffect, useState } from "react"
import { LoginContext } from "contexts/login"
import { api } from "api"
import { AdaptiveShadowView } from "components/BoxShadow"
import { Pressable, View } from "react-native"
import { Icon } from "components/Icon"
import arrowRightSvg from "assets/exams/arrow_right.svg"
import { usePalette } from "utils/colors"
import {
  ExamStatusType,
  getExamStatus,
  getExamStatusDescription,
  monthsAcronymsEN,
  monthsAcronymsIT,
} from "utils/exams"
import { useCurrentLanguage } from "utils/language"
import { ExamInfoWhiteLine } from "components/Exams/ExamInfoWhiteLine"
import { useApiCall } from "api/useApiCall"

export const Exams: MainStackScreen<"Exams"> = props => {
  /* const { t } = useTranslation("exams") */

  const lan = useCurrentLanguage()

  const navigation = useNavigation()
  const { loggedIn } = useContext(LoginContext)

  const [examsWithGradeCount, setExamsWithGradeCount] = useState(0)

  const { palette } = usePalette()

  const [teachings, loading, error, updateTeachings] = useApiCall(
    api.exams.getTeachings,
    {},
    [loggedIn],
    {},
    !loggedIn,
  )

  // when the user navigates back to the exams page, update the teachings
  // if updateTeachings flag is set to true
  useEffect(() => {
    navigation.addListener("focus", updateTeachings)

    return () => {
      navigation.removeListener("focus", updateTeachings)
    }
  }, [props.route.params?.updateTeachings])

  useEffect(() => {
    // count number of exams with grade
    let count = 0
    if (teachings) {
      teachings.forEach(teaching => {
        teaching.appelliEsame.forEach(exam => {
          if (getExamStatus(exam).type == ExamStatusType.ESITO_DISPONIBILE) {
            count++
          }
        })
      })
    }
    setExamsWithGradeCount(count)
  }, [teachings])

  return (
    <ListPage
      title={"Exams"}
      errorMessage={error?.message}
      emptyMessage="Nessun appello disponibile"
      loading={loading && teachings === null}
      refreshControl={{
        refreshing: loading,
        onRefresh: updateTeachings,
      }}
      data={teachings ?? []}
      headerComponent={
        <Pressable
          onPress={() => {
            navigation.navigate("Results", { teachings: teachings ?? [] })
          }}
        >
          <View
            style={{
              backgroundColor: palette.primary,
              borderRadius: 16,
              height: 52,
              marginHorizontal: 0,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1 }} />
            <BodyText
              style={{
                color: "#fff",
                fontWeight: "900",
                fontSize: 16,
              }}
            >
              ESITI
            </BodyText>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <View
                style={{
                  height: 28,
                  width: 28,
                  borderRadius: 14,
                  backgroundColor: palette.accent,
                  marginRight: 16,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BodyText
                  style={{
                    fontSize: 16,
                    fontWeight: "900",
                    color: palette.primary,
                  }}
                >
                  {examsWithGradeCount}
                </BodyText>
              </View>
            </View>
          </View>
        </Pressable>
      }
      renderItem={({ item }) => {
        return item.appelliEsame.length === 0 ? null : (
          <View
            key={item.c_insegn_piano}
            style={{
              alignItems: "stretch",
              marginBottom: 16,
              marginHorizontal: 16,
              borderRadius: 16,
              backgroundColor: palette.lighter,
            }}
          >
            <AdaptiveShadowView
              style={{ marginBottom: 16 }}
              contentContainerStyle={{
                backgroundColor: palette.primary,
                height: 52,
                flex: 1,
                paddingVertical: 8,
                flexDirection: "row",
                alignItems: "center",
                borderRadius: 16,
              }}
              shadow={{ offset: { y: 4 }, opacity: 0.25, blur: 4 }}
            >
              <Pressable
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                }}
                onPress={() => {
                  navigation.navigate("TeachingDetails", { teaching: item })
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                >
                  <BodyText
                    style={{
                      fontWeight: "900",
                      color: "white",
                      fontSize: 16,
                      flex: 1,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.xdescrizione}
                  </BodyText>

                  <Icon source={arrowRightSvg} scale={1.2} />
                </View>
              </Pressable>
            </AdaptiveShadowView>
            {item.appelliEsame?.map(exam => {
              const dateExam = new Date(exam.d_app)

              const day = dateExam.getDate()

              const month =
                lan === "it"
                  ? monthsAcronymsIT[dateExam.getMonth()]
                  : monthsAcronymsEN[dateExam.getMonth()]

              const year = dateExam.getFullYear()

              const status = getExamStatus(exam)
              return (
                <View
                  key={exam.c_appello}
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <BodyText
                      style={{
                        marginLeft: 16,
                        color: "#fff",
                        fontSize: 14,
                        fontWeight: "300",
                      }}
                    >
                      <BodyText
                        style={{
                          fontWeight: "900",
                          color: "#fff",
                          fontSize: 14,
                        }}
                      >
                        {day}
                      </BodyText>{" "}
                      {month} {year}
                    </BodyText>
                    <BodyText
                      style={{
                        marginRight: 16,
                        color: status.isHighlighted ? palette.accent : "#fff",
                        fontSize: 12,
                        fontWeight: "900",
                      }}
                    >
                      {getExamStatusDescription(status.type, lan).toUpperCase()}
                    </BodyText>
                  </View>
                  {status.type === ExamStatusType.ISCRITTO && (
                    // ! add onPress
                    <ExamInfoWhiteLine exam={exam} type={status.type} />
                  )}
                </View>
              )
            })}
          </View>
        )
      }}
    />
  )
}
