import { FC, useContext, useEffect, useState } from "react"
import { Alert, Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { CrowdSliderStatic } from "./CrowdSlider/CrowdSliderStatic"
import { CrowdSliderDynamic } from "./CrowdSlider/CrowdSliderDynamic"
import { CrowdSliderLabels } from "./CrowdSlider/CrowdSliderLabels"
import { api, RetryType } from "api"
import { Modal } from "components/Modal"
import { LoginContext } from "contexts/login"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

const contentPadding = 20

interface CrowdingSectionProps {
  roomId: number
  isSlidable?: boolean
  onSlided?: () => void
}

export const CrowdingSection: FC<CrowdingSectionProps> = props => {
  const { iconHighContrast, labelsHighContrast } = usePalette()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [occupancyRate, setOccupancyRate] = useState<number>(1)

  const { loggedIn } = useContext(LoginContext)

  const { navigate } = useNavigation()

  const { t } = useTranslation("freeClass")

  const crowdingOpinionMessage = t("freeClass_crowdingOpinion").split("-")

  let occupancyRateUser = 3

  const getOccupancyRate = async () => {
    try {
      const res = await api.rooms.getOccupancyRate(props.roomId)
      if (res.occupancy_rate !== null) {
        setOccupancyRate(res.occupancy_rate)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    void getOccupancyRate()
  }, [])

  const postOccupancyRate = async () => {
    try {
      await api.rooms.postOccupancyRate(props.roomId, occupancyRateUser, {
        retryType: RetryType.RETRY_N_TIMES,
        maxRetries: 3,
      })
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <View style={{ marginBottom: 18, marginTop: 46 }}>
      <BodyText
        style={{
          fontSize: 20,
          fontWeight: "900",
          color: labelsHighContrast,
        }}
      >
        {t("freeClass_crowding")}:
      </BodyText>

      <CrowdSliderStatic position={occupancyRate} />
      <CrowdSliderLabels />
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <BodyText
          style={{
            fontSize: 13,
            fontWeight: "400",
            color: iconHighContrast,
          }}
        >
          {crowdingOpinionMessage[0]}
        </BodyText>
        <Pressable
          hitSlop={8}
          onPress={() => {
            if (loggedIn) {
              setIsModalVisible(true)
            } else {
              Alert.alert(
                "Non hai fatto il login",
                "Se vuoi esprimere un'opinione sull'affollamento dell'aula effettua il login",
                [
                  { text: "Indietro" },
                  { text: "Login", onPress: () => navigate("Login" as never) },
                ],
                { cancelable: true }
              )
            }
          }}
        >
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "900",
              color: iconHighContrast,
              textDecorationLine: "underline",
            }}
          >
            {crowdingOpinionMessage[1]}
          </BodyText>
        </Pressable>
      </View>

      <Modal
        isShowing={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title={t("freeClass_modalTitle")}
        subTitle={"" + t("freeClass_modalSubtitle").replace("-", "\n")}
        subTitleStyle={{
          fontWeight: "900",
          color: iconHighContrast,
          marginTop: 58,
          marginVertical: 0,
        }}
        centerText={true}
        buttons={[
          {
            text: "Conferma",
            light: false,
            style: {
              alignSelf: "center",
              minWidth: 103,
              marginTop: 16,
              marginBottom: 10,
            },
            onPress: () => {
              void postOccupancyRate()
              setIsModalVisible(false)
            },
          },
        ]}
      >
        <View style={{ marginTop: 26, paddingHorizontal: contentPadding }}>
          <CrowdSliderDynamic
            startingPos={occupancyRateUser}
            onSlideEnd={(pos: number) => (occupancyRateUser = pos)}
            contentPadding={contentPadding}
          />
          <CrowdSliderLabels />
        </View>
      </Modal>
    </View>
  )
}
