import React, { FC } from "react"
import { View, Modal, StyleSheet, Pressable } from "react-native"
import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import { ButtonCustom } from "./ButtonCustom"

export interface ModalConfirmProps {
    text: string

    /**
     * whether ot not to show the modal
     */
    isShowing: boolean
    /**
     * this function hides the modal by changing the state in the parent component
     */
    onClose: () => void

    /**
     * function called when button "OK" is pressed
     */
    onOK: () => void
}

/**
 * Custom Modal Component with two buttons at the bottom.
 *
 */
export const ModalConfirm: FC<ModalConfirmProps> = props => {
    const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
        usePalette()

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
                    ]}
                >
                    <View>
                        <BodyText
                            style={[
                                styles.text,
                                {
                                    color: isLight ? homeBackground : "#ffffff",
                                },
                                {
                                    marginTop: 32,
                                    marginBottom: 12,
                                },
                            ]}
                        >
                            {props.text}
                        </BodyText>
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
                            text={"Annulla"}
                            onPress={props.onClose}
                        />
                        <ButtonCustom
                            light={false}
                            text={"Conferma"}
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
        paddingHorizontal: 15,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    text: {
        textAlign: "center",
        fontSize: 17,
        fontWeight: "500",
    },
})
