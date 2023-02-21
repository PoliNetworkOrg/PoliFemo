import React, { FC } from "react"
import { View, StyleSheet, ViewStyle, Dimensions } from "react-native"
import { Text } from "components/Text"
import { ButtonCustom } from "components/Button"
import { usePalette } from "utils/colors"
import { Portal } from "react-native-portalize"
import Modal from "react-native-modal"
export interface ModalWithButtonsProps {
  /**
   * content of the modal
   */
  children: React.ReactNode

  title?: string

  leftButtonTitle?: string
  rightButtonTitle?: string

  /**
   * whether ot not to show the modal
   */
  isShowing: boolean
  /**
   * this function hides the modal by changing the state in the parent component
   */
  onClose: () => void

  /**
   * function called when the right button is pressed
   */
  onOK: () => void

  animationTiming?: number

  /**override center container's style, for example changing height */
  style?: ViewStyle
}

/**
 * Custom Modal Component with two buttons at the bottom.
 *
 */
export const ModalWithButtons: FC<ModalWithButtonsProps> = props => {
  const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
    usePalette()

  const deviceHeight = Dimensions.get("screen").height

  const leftButtonTitle = props.leftButtonTitle ?? "Annulla"

  const rightButtonTitle = props.rightButtonTitle ?? "OK"

  return (
    <Portal>
      <Modal
        needsOffscreenAlphaCompositing={true}
        renderToHardwareTextureAndroid={true}
        onBackButtonPress={props.onClose}
        statusBarTranslucent={true}
        isVisible={props.isShowing}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        backdropColor={modalBarrier}
        deviceHeight={deviceHeight}
        coverScreen={false}
        animationInTiming={props.animationTiming ?? 200}
        animationOutTiming={props.animationTiming ?? 200}
        onBackdropPress={props.onClose}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}
      >
        <View style={styles.pageWrapper}>
          <View
            style={[
              {
                flexDirection: "column",
                justifyContent: "space-between",
                width: 320,
                borderRadius: 12,
                marginHorizontal: 15,

                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.27,
                shadowRadius: 4.65,
                backgroundColor: backgroundSecondary,
              },
              props.isShowing ? { elevation: 6 } : undefined,
              props.style,
            ]}
          >
            <View>
              {props.title && (
                <Text
                  style={[
                    styles.title,
                    {
                      color: isLight ? homeBackground : "#ffffff",
                    },
                    {
                      textAlign: "center",
                      marginTop: 22,
                      marginBottom: 12,
                    },
                  ]}
                >
                  {props.title}
                </Text>
              )}

              {props.children}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginBottom: 32,
                marginTop: 16,
              }}
            >
              <ButtonCustom
                light={true}
                text={leftButtonTitle}
                onPress={props.onClose}
              />
              <ButtonCustom
                light={false}
                text={rightButtonTitle}
                onPress={props.onOK}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
  },
})
