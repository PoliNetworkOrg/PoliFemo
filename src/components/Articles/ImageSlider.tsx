import { FC, useEffect, useState } from "react"
import { View, Pressable, Dimensions, Image, StyleSheet } from "react-native"
import { usePalette } from "utils/colors"
import deleteSvg from "assets/modal/delete.svg"
import { ZoomableImage } from "./ZoomableImage"
import { Easing, useSharedValue, withTiming } from "react-native-reanimated"
import arrow_right from "assets/articles/arrow_right.svg"
import arrow_left from "assets/articles/arrow_left.svg"
import { BodyText } from "components/Text"
import { useMounted } from "utils/useMounted"
import { Icon } from "components/Icon"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { Portal } from "react-native-portalize"
import _Modal from "react-native-modal"
export interface ImageSliderProps {
  imageSources: string[]
  activeIndex: number
  onClose: () => void
  isVisible: boolean
}

/**
 *Image Slider (still work in progress).
 *
 */
export const ImageSlider: FC<ImageSliderProps> = props => {
  const { modalBarrier } = usePalette()

  const isMounted = useMounted()

  const fullWidth = Dimensions.get("window").width

  const fullHeight = Dimensions.get("window").height

  const [imageIndex, setImageIndex] = useState(props.activeIndex)

  useEffect(() => {
    if (isMounted) {
      setImageIndex(props.activeIndex)

      if (props.imageSources.length > 0) {
        setSource(props.imageSources[props.activeIndex])
      }
    }
  }, [props.activeIndex, props.imageSources])

  const [height, setHeight] = useState(0)

  const [source, setSource] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (props.imageSources.length > 0 && source) {
      Image.getSize(source, (width, height) => {
        setHeight((height * fullWidth) / width)
      })
    }
  }, [source])

  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const position = useSharedValue(0)
  const lastPosition = useSharedValue(0)

  return (
    <Portal>
      <_Modal
        needsOffscreenAlphaCompositing={true}
        renderToHardwareTextureAndroid={true}
        onBackButtonPress={props.onClose}
        statusBarTranslucent={true}
        isVisible={props.isVisible}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        backdropColor={modalBarrier}
        style={{ margin: 0 }}
        deviceHeight={Dimensions.get("screen").height}
        coverScreen={false}
        animationInTiming={200}
        animationOutTiming={200}
        hasBackdrop={false}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={e => {
              //close if tap is out of image
              const imageHeight = height * scale.value
              const y = e.nativeEvent.pageY
              const borderLimitUp = (fullHeight - imageHeight) / 2
              const borderLimitDown = borderLimitUp + imageHeight
              if (y < borderLimitUp || y > borderLimitDown) {
                props.onClose()
              }
            }}
          >
            <Pressable
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                zIndex: 2,
                top: 100,
                right: 22,
              }}
              onPress={() => props.onClose()}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor: "#ffffff",
                  borderRadius: 14,
                  marginBottom: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon source={deleteSvg} />
              </View>
            </Pressable>
            <View
              style={{
                flex: 1,
                position: "absolute",
                width: fullWidth,
                zIndex: 2,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
              }}
            >
              <Pressable
                onPress={() => {
                  scale.value = withTiming(1, { easing: Easing.ease })
                  savedScale.value = 1
                  lastPosition.value = 0
                  position.value = withTiming(0, {
                    easing: Easing.ease,
                  })
                  setImageIndex(
                    (imageIndex - 1 + props.imageSources.length) %
                      props.imageSources.length
                  )
                }}
              >
                <View style={styles.arrow}>
                  <Icon source={arrow_left} />
                </View>
              </Pressable>
              <Pressable
                style={{}}
                onPress={() => {
                  scale.value = withTiming(1, { easing: Easing.ease })
                  savedScale.value = 1
                  lastPosition.value = 0
                  position.value = withTiming(0, {
                    easing: Easing.ease,
                  })
                  setImageIndex((imageIndex + 1) % props.imageSources.length)
                }}
              >
                <View style={styles.arrow}>
                  <Icon source={arrow_right} />
                </View>
              </Pressable>
            </View>
            <View
              style={{
                position: "absolute",
                width: fullWidth,
                bottom: 110,
                zIndex: 2,
                alignItems: "center",
              }}
            >
              <BodyText
                style={{
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {imageIndex + 1} / {props.imageSources.length}
              </BodyText>
            </View>
            {source && (
              <ZoomableImage
                uri={source}
                height={height}
                style={{ backgroundColor: modalBarrier }}
                position={position}
                lastPosition={lastPosition}
                scale={scale}
                savedScale={savedScale}
              />
            )}
          </Pressable>
        </GestureHandlerRootView>
      </_Modal>
    </Portal>
  )
}

const arrowDiameter = 24

const styles = StyleSheet.create({
  arrow: {
    width: arrowDiameter,
    height: arrowDiameter,
    backgroundColor: "#ffffff",
    borderRadius: arrowDiameter / 2,
    justifyContent: "center",
    alignItems: "center",
  },
})
