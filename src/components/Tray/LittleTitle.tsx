import { FC, useEffect, useRef } from "react"
import { LinearGradient } from "expo-linear-gradient"
import MaskedView from "@react-native-masked-view/masked-view"
import { Animated, Easing } from "react-native"

import { Text } from "components/Text"

interface LittleTitleProps {
  titleInCorner: boolean
}

export const LittleTitle: FC<LittleTitleProps> = ({ titleInCorner }) => {
  const slide = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (titleInCorner) {
      Animated.timing(slide, {
        toValue: 1,
        duration: 250,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(slide, {
        toValue: 0,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start()
    }
  }, [titleInCorner])

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: slide,
      }}
    >
      {/* TODO: update maked-view and remove this comment as soon as they fix the types
          eslint-disable-next-line @typescript-eslint/ban-ts-comment
          @ts-ignore  */}
      <MaskedView
        nativeID="little-title"
        style={{ flex: 1, marginLeft: 28 }}
        maskElement={
          <Text>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 20,
                color: "black",
              }}
            >
              POLI
            </Text>
            <Text
              style={{
                fontWeight: "300",
                fontSize: 20,
                color: "black",
              }}
            >
              FEMO
            </Text>
          </Text>
        }
      >
        <LinearGradient
          colors={[
            "rgba(135, 145, 189, 1)",
            "rgba(135, 145, 189, 1)",
            "rgba(135, 145, 189, 0.43)",
            "rgba(255, 255, 255, 0)",
            "rgba(255, 255, 255, 0.09)",
            "rgba(255, 255, 255, 0.0)",
          ]}
          locations={[0, 0.3833, 0.6229, 0.9998, 0.9999, 1]}
          style={{ flex: 1 }}
        />
      </MaskedView>
    </Animated.View>
  )
}
