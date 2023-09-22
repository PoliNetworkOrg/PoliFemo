import { api } from "api"
import { useApiCall } from "api/useApiCall"
import { ErrorMessage } from "components/ErrorMessage"
import { GradingBookCareerInfo } from "components/GradingHook/GradingBookCareerInfo"
import { ProgressCircleCareer } from "components/GradingHook/ProgressCircleCareer"
import { LoadingIndicator } from "components/LoadingIndicator"
import { PageWrap } from "components/PageLayout"
import { Text } from "components/Text"
import { LoginContext } from "contexts/login"
import { MainStackScreen } from "navigation/NavigationTypes"
import { useContext, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"
import { palette, usePalette } from "utils/colors"

export const GradingBook: MainStackScreen<"GradingBook"> = () => {
  const { isLight } = usePalette()
  const { loggedIn, userInfo } = useContext(LoginContext)
  const { t } = useTranslation("gradingBook")

  const styles = useMemo(
    () =>
      StyleSheet.create({
        careerSubtitle: {
          fontSize: 20,
          textAlign: "center",
          fontWeight: "500",
          color: isLight ? palette.primary : "#ffffff",
        },
      }),
    [isLight]
  )

  const { matricola } = userInfo?.careers?.[0] ?? {}

  const [careerStats, loading] = useApiCall(
    api.gradingbook.getGradingBook,
    { matricola: matricola ?? "" },
    [loggedIn],
    {},
    !loggedIn
  )

  return (
    <PageWrap title={t("gradingBook_title")}>
      {loading ? (
        <LoadingIndicator />
      ) : !careerStats ? (
        <ErrorMessage message={t("gradingBook_error_message")} />
      ) : (
        <>
          <Text style={styles.careerSubtitle}>{t("gradingBook_career")}</Text>

          <ProgressCircleCareer
            cfusGiven={careerStats.given_cfu}
            cfusPlanned={careerStats.planned_cfu}
            examsGiven={careerStats.exam_stats.given}
            examsPlanned={careerStats.exam_stats.planned}
            average={careerStats.mean}
          />

          <GradingBookCareerInfo
            cfusGiven={careerStats.given_cfu}
            cfusPlanned={careerStats.planned_cfu}
            examsGiven={careerStats.exam_stats.given}
            examsPlanned={careerStats.exam_stats.planned}
          />
        </>
      )}
    </PageWrap>
  )
}
