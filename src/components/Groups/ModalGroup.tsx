import React, { FC } from "react"
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  Dimensions,
} from "react-native"
import { usePalette } from "utils/colors"
import { ButtonCustom } from "components/Button"
import deletesvg from "assets/modal/delete.svg"
import { Group } from "api/groups"
import Modal from "react-native-modal"
import { Portal } from "react-native-portalize"
import { Icon } from "components/Icon"

export interface ModalGroupProps {
  /**
   * content of the modal
   */
  children: React.ReactNode

  /**
   * whether ot not to show the modal
   */
  isShowing: boolean
  /**
   * this function hides the modal by changing the state in the parent component
   */
  onClose: () => void

  /**
   * function called when button "JOIN GROUP" is pressed
   */
  onJoin: (group?: Group) => void

  group?: Group

  animationTiming?: number

  /**override center container's style, for example changing height */
  style?: ViewStyle
}

/**
 * Custom Modal Component for Groups Page.
 *
 */
export const ModalGroup: FC<ModalGroupProps> = props => {
  const { backgroundSecondary, modalBarrier, isLight } = usePalette()
  const deviceHeight = Dimensions.get("screen").height

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
        <View style={[styles.pageWrapper]}>
          <View>
            <Pressable
              style={{ alignSelf: "flex-end" }}
              onPress={() => props.onClose()}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#ffffff",
                  borderRadius: 15,
                  marginBottom: 8,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Icon source={deletesvg} />
              </View>
            </Pressable>
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
                  elevation: 6,
                },
                props.style,
              ]}
            >
              <View>{props.children}</View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginBottom: 32,
                  marginTop: 16,
                }}
              >
                <ButtonCustom
                  style={{
                    backgroundColor: isLight ? "#424967" : "#8791BD",
                  }}
                  text={"JOIN GROUP"}
                  onPress={() => props.onJoin(props.group)}
                />
              </View>
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
