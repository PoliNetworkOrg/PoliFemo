import React, { FC } from "react"
import { View, Modal, StyleSheet, Pressable } from "react-native"
import { Text } from "components/Text"
import { ButtonCustom } from "components/Button"
import { usePalette } from "utils/colors"

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

    /**
     * modal wrapper height, specify if height is fixed
     */
    height?: number
}

/**
 * Custom Modal Component with two buttons at the bottom.
 *
 */
export const ModalWithButtons: FC<ModalWithButtonsProps> = props => {
    const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
        usePalette()

    const leftButtonTitle = props.leftButtonTitle ?? "Annulla"

    const rightButtonTitle = props.rightButtonTitle ?? "OK"

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
                <Pressable
                    // this is a pressable just to prevent the modal from closing when clicking
                    // on the content
                    style={[
                        styles.contentWrapper,
                        { backgroundColor: backgroundSecondary },
                        { height: props.height },
                    ]}
                >
                    <View>
                        {props.title && (
                            <Text
                                style={[
                                    styles.title,
                                    {
                                        color: isLight
                                            ? homeBackground
                                            : "#ffffff",
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
                </Pressable>
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