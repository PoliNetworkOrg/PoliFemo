import React, { FC } from "react"
import {
  View,
  StyleSheet,
  Pressable,
  ViewStyle,
  StyleProp,
  Dimensions,
  TextStyle,
} from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import deletesvg from "assets/modal/delete.svg"
import _Modal from "react-native-modal"
import { Portal } from "react-native-portalize"
import { Icon, IconProps } from "./Icon"
import { AdaptiveShadowView } from "./BoxShadow"
import { ButtonProps, Button } from "components/Button"
import { GestureHandlerRootView } from "react-native-gesture-handler"

export interface ModalCustomProps {
  children: React.ReactNode

  /**
   * Big title, can be centered with `centerText` prop
   **/
  title: string

  /**
   * Optional, way smaller subtitle
   **/
  subTitle?: string

  /**
   * whether ot not to show the modal
   */
  isShowing: boolean

  /**
   * This function gets called on press of the close X button, if missing the
   * button will not be rendered
   */
  onClose?: () => void

  /**
   * whether ot not to center title and subtitle and apply different margins
   * @default false
   */
  centerText?: boolean

  /**
   * duration of fade animation in ms
   * @default 200
   **/
  animationTiming?: number

  /**
   * override outer container's style, for example changing height
   **/
  style?: StyleProp<ViewStyle>

  /**
   * override subtitle style
   */
  subTitleStyle?: StyleProp<TextStyle>

  /**
   * override the content container's style, for example changing padding
   **/
  contentContainerStyle?: StyleProp<ViewStyle>

  /**
   * array of buttons to be displayed at the bottom of the modal
   * */
  buttons?: ButtonProps[]

  /**
   * optional icon to be displayed at the top of the modal
   **/
  icon?: IconProps
}

/**
 * custom modal component
 *
 */
export const Modal: FC<ModalCustomProps> = props => {
  const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
    usePalette()
  const centerText = props.centerText ?? false

  return (
    <Portal>
      <_Modal
        needsOffscreenAlphaCompositing={true}
        renderToHardwareTextureAndroid={true}
        onBackButtonPress={props.onClose}
        statusBarTranslucent={true}
        isVisible={props.isShowing}
        animationIn={"fadeIn"}
        animationOut={"fadeOut"}
        backdropColor={modalBarrier}
        style={{ margin: 0 }}
        deviceHeight={Dimensions.get("screen").height}
        coverScreen={false}
        animationInTiming={props.animationTiming ?? 200}
        animationOutTiming={props.animationTiming ?? 200}
        hasBackdrop={false}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Pressable style={styles.pageWrapper} onPress={props.onClose}>
            {props.onClose && (
              <Pressable
                style={styles.circle}
                onPress={() => props.onClose?.()}
              >
                <Icon source={deletesvg} />
              </Pressable>
            )}
            <AdaptiveShadowView
              shadow={{
                blur: 50,
                offset: { y: -8 },
                opacity: 0.37,
              }}
              style={[{ width: 320 }, props.style]}
              contentContainerStyle={[
                {
                  borderRadius: 12,
                  backgroundColor: backgroundSecondary,
                  paddingTop: 24,
                },
                props.contentContainerStyle,
              ]}
            >
              {props.icon && (
                <View
                  style={{
                    borderRadius: 44,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon {...props.icon} />
                </View>
              )}
              <Text
                style={[
                  styles.title,
                  {
                    color: isLight ? homeBackground : "#ffffff",
                    textAlign: centerText ? "center" : "left",
                  },
                ]}
              >
                {props.title}
              </Text>
              {props.subTitle && (
                <Text
                  style={[
                    styles.subTitle,
                    {
                      color: isLight ? homeBackground : "#ffffff",
                      textAlign: centerText ? "center" : "left",
                      marginVertical: 8,
                    },
                    props.subTitleStyle,
                  ]}
                >
                  {props.subTitle}
                </Text>
              )}
              <View style={{ maxHeight: 280 }}>{props.children}</View>
              {props.buttons && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginBottom: 32,
                    marginTop: 16,
                  }}
                >
                  {props.buttons.map((props, i) => (
                    <Button {...props} key={i} />
                  ))}
                </View>
              )}
            </AdaptiveShadowView>
          </Pressable>
        </GestureHandlerRootView>
      </_Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#011B2973", // very specific color on Figma
  },
  circle: {
    left: 157, // (modal.width / 2) - (circle.width / 2) + 12
    zIndex: 1,
    width: 30,
    height: 30,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    marginHorizontal: 27,
    marginTop: 12,
    fontWeight: "900",
  },
  subTitle: {
    fontSize: 13,
    marginHorizontal: 27,
    fontWeight: "600",
  },
})
