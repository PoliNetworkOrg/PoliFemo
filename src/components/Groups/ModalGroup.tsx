import React, { FC } from "react"
import { View, Modal, StyleSheet, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { ButtonCustom } from "components/Settings"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { deleteSvg as icon } from "assets/modal"
import { Group } from "api/groups"

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
  /**
   * modal wrapper height, specify if height is fixed
   */
  height?: number
}

/**
 * Custom Modal Component for Groups Page.
 *
 */
export const ModalGroup: FC<ModalGroupProps> = props => {
  const { backgroundSecondary, modalBarrier, isLight } = usePalette()

  const deleteSvg = useSVG(icon.svg)
  return (
    //TODO: animationType fade or slide?
    <Modal
      onRequestClose={props.onClose}
      statusBarTranslucent={true}
      visible={props.isShowing}
      animationType="fade"
      transparent={true}
    >
      <Pressable
        onPress={props.onClose}
        style={[styles.pageWrapper, { backgroundColor: modalBarrier }]}
      >
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
              <Canvas
                style={{
                  width: icon.width,
                  height: icon.heigth,
                }}
              >
                {deleteSvg && (
                  <ImageSVG
                    svg={deleteSvg}
                    x={0}
                    y={0}
                    width={icon.width}
                    height={icon.heigth}
                  />
                )}
              </Canvas>
            </View>
          </Pressable>
          <Pressable
            // this is a pressable just to prevent the modal from closing when clicking
            // on the content
            style={[
              styles.contentWrapper,
              { backgroundColor: backgroundSecondary },
              { height: props.height },
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
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  pageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentWrapper: {
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
    elevation: 6,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
  },
})
