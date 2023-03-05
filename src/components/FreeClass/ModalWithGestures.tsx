import React, { FC } from "react"
import { View, Modal, StyleSheet, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import icon from "assets/modal/delete.svg"
import { gestureHandlerRootHOC } from "react-native-gesture-handler"
import { Icon } from "components/Icon"
export interface ModalWithGesturesProps {
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
}

/**
 * custom modal component that can use reanimated gestures!! The problem with standard modals is
 * that gestures wrapped inside Pressable dont work. The content needs to use `gestureHandlerRootHOC`
 * as implemented below.
 *
 */
export const ModalWithGestures: FC<ModalWithGesturesProps> = props => {
  const { backgroundSecondary, modalBarrier } = usePalette()

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const ContentRootHOC = gestureHandlerRootHOC(() => (
    <Pressable
      onPress={props.onClose}
      style={[styles.pageWrapper, { backgroundColor: modalBarrier }]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{ alignSelf: "flex-end" }}
          onPress={() => props.onClose()}
        >
          <View style={styles.circle}>
            <Icon source={icon} />
          </View>
        </Pressable>
        <Pressable
          // this is a pressable just to prevent the modal from closing when clicking
          // on the content
          style={[
            styles.contentWrapper,
            { backgroundColor: backgroundSecondary },
          ]}
        >
          <View style={{ width: 320, height: 420 }}>{props.children}</View>
        </Pressable>
      </View>
    </Pressable>
  ))

  return (
    //TODO: animationType fade or slide?
    <Modal
      onRequestClose={props.onClose}
      statusBarTranslucent={true}
      visible={props.isShowing}
      animationType="fade"
      transparent={true}
    >
      <ContentRootHOC />
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
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  circle: {
    width: 30,
    height: 30,
    backgroundColor: "#ffffff",
    borderRadius: 15,
    marginTop: 96,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
})
