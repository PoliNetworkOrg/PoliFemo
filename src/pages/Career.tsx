import { api } from "api"
import { useApiCall } from "api/useApiCall"
import { CareerStatsCircle } from "components/Career/CareerStatsCircle"
import { PageWrap } from "components/PageLayout"
import { Text } from "components/Text"
import { LoginContext } from "contexts/login"
import { MainStackScreen } from "navigation/NavigationTypes"
import { useContext, useMemo } from "react"
import { StyleSheet } from "react-native"
import { palette, usePalette } from "utils/colors"

export const Career: MainStackScreen<"Career"> = () => {
  const { isLight } = usePalette()

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

  const { loggedIn, userInfo } = useContext(LoginContext)
  const { matricola } = userInfo?.careers?.[0] ?? {}
  const [careerStats, loading, error] = useApiCall(
    api.career.getCareer,
    { matricola: matricola ?? "" },
    [loggedIn],
    {},
    !loggedIn
  )

  return (
    <PageWrap title="Career">
      <Text style={styles.careerSubtitle}>Andamento Carriera</Text>
      {careerStats && (
        <CareerStatsCircle
          mean={careerStats.mean}
          innerProgress={
            careerStats.exam_stats.given / careerStats.exam_stats.planned
          }
          outerProgress={careerStats.given_cfu / careerStats.planned_cfu}
        />
      )}
    </PageWrap>
  )
}
