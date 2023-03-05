import React, { FC } from "react"
import {
  View,
  StyleSheet,
  Pressable,
  Dimensions,
  ViewStyle,
  StyleProp,
} from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import deletesvg from "assets/modal/delete.svg"
import _Modal from "react-native-modal"
import { Portal } from "react-native-portalize"
import { Icon, IconProps } from "./Icon"
import { AdaptiveShadowView } from "./BoxShadow"
import { ButtonProps, Button } from "components/Button"

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
  const deviceHeight = Dimensions.get("screen").height
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
        deviceHeight={deviceHeight}
        coverScreen={false}
        animationInTiming={props.animationTiming ?? 200}
        animationOutTiming={props.animationTiming ?? 200}
        onBackdropPress={props.onClose}
        useNativeDriverForBackdrop={true}
        useNativeDriver={true}
      >
        <View style={[styles.pageWrapper]}>
          {props.onClose && (
            <Pressable
              style={{ alignSelf: "flex-end", zIndex: 1 }}
              onPress={() => props.onClose?.()}
            >
              <View style={styles.circle}>
                <Icon source={deletesvg} />
              </View>
            </Pressable>
          )}
          <AdaptiveShadowView
            shadow={{
              blur: 50,
              offset: { y: -8 },
              opacity: 0.37,
            }}
            style={[
              {
                width: 320,
                marginHorizontal: 15,
              },
              props.style,
            ]}
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
                ]}
              >
                {props.subTitle}
              </Text>
            )}
            <View>{props.children}</View>
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
        </View>
      </_Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
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
