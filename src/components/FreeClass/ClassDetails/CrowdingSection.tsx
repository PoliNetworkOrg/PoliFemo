import React, { FC, useEffect, useState } from "react"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { CrowdSliderStatic } from "./CrowdSlider/CrowdSliderStatic"
import { CrowdSliderDynamic } from "./CrowdSlider/CrowdSliderDynamic"
import { CrowdSliderLabels } from "./CrowdSlider/CrowdSliderLabels"
import { ButtonCustom } from "components/Button"
import { ModalWithGestures } from "../ModalWithGestures"
import { api, RetryType } from "api"

interface CrowdingSectionProps {
  roomId: number
  isSlidable?: boolean
  onSlided?: () => void
}

export const CrowdingSection: FC<CrowdingSectionProps> = props => {
  const { iconHighContrast, labelsHighContrast } = usePalette()

  const [isModalVisible, setIsModalVisible] = useState(false)

  const [occupancyRate, setOccupancyRate] = useState<number>(1)

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
        Affollamento:
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
          Se il dato sull&apos;affollamento non è corretto
        </BodyText>
        <Pressable hitSlop={8} onPress={() => setIsModalVisible(true)}>
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "900",
              color: iconHighContrast,
              textDecorationLine: "underline",
            }}
          >
            esprimi opinione
          </BodyText>
        </Pressable>
      </View>

      <ModalWithGestures
        isShowing={isModalVisible}
        onClose={() => setIsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 26,
            flexDirection: "column",
            justifyContent: "space-between",
            marginBottom: 44,
            marginTop: 72,
          }}
        >
          <BodyText
            style={{
              fontSize: 32,
              fontWeight: "900",
              color: iconHighContrast,
              textAlign: "center",
            }}
          >
            Esprimi{"\n"}Opinione
          </BodyText>
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "900",
              color: iconHighContrast,
              textAlign: "center",
            }}
          >
            Indica il livello di affollamento {"\n"} dell&apos;aula
          </BodyText>
          <View>
            <CrowdSliderDynamic
              startingPos={occupancyRateUser}
              onSlideEnd={(pos: number) => (occupancyRateUser = pos)}
            />
            <CrowdSliderLabels />
          </View>

          <ButtonCustom
            text="Conferma"
            light={false}
            style={{ alignSelf: "center", minWidth: 103 }}
            onPress={() => {
              void postOccupancyRate()
              setIsModalVisible(false)
            }}
          />
        </View>
      </ModalWithGestures>
    </View>
  )
}