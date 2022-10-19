import React, { FC } from "react"
import { View, Modal, StyleSheet, Text, Pressable } from "react-native"

import { usePalette } from "utils/colors"

export interface ModalCustomProps {
    /**
     * content of the modal
     */
    children: React.ReactNode
    title: string
    subTitle?: string
    /**
     * whether ot not to show the modal
     */
    isShowing: boolean
    /**
     * this function hides the modal by changing the state in the parent component
     */
    toggleModal: () => void

    /**
     * whether ot not to center title and subtitle and apply different margins
     * @default false
     */
    centerText?: boolean
}

/**
 * custom modal component
 *
 */
export const ModalCustom: FC<ModalCustomProps> = props => {
    const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
        usePalette()
    const centerText = props.centerText ?? false
    return (
        //TODO: animationType fade or slide?
        <Modal
            statusBarTranslucent={true}
            visible={props.isShowing}
            animationType="fade"
            transparent={true}
            style={{}}
        >
            <View
                style={[styles.pageWrapper, { backgroundColor: modalBarrier }]}
            >
                <View>
                    <Pressable
                        style={{ alignSelf: "flex-end" }}
                        onPress={() => props.toggleModal()}
                    >
                        <View style={styles.circle}>
                            <Text style={{ textAlign: "center" }}>X</Text>
                            {/* TODO : replace "X" with svg*/}
                        </View>
                    </Pressable>
                    <View
                        style={[
                            styles.contentWrapper,
                            { backgroundColor: backgroundSecondary },
                        ]}
                    >
                        <Text
                            style={[
                                styles.title,
                                { color: isLight ? homeBackground : "#ffffff" },
                                { textAlign: centerText ? "center" : "left" },
                                { marginTop: centerText ? 72 : 36 },
                            ]}
                        >
                            {props.title}
                        </Text>
                        <Text
                            style={[
                                styles.subTitle,
                                { color: isLight ? homeBackground : "#ffffff" },
                                { textAlign: centerText ? "center" : "left" },
                                { marginTop: centerText ? 56 : 8 },
                            ]}
                        >
                            {props.subTitle}
                        </Text>
                        {props.children}
                    </View>
                </View>
            </View>
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
        width: 320,
        height: 420,
        borderRadius: 12,
        paddingHorizontal: 27,
        marginHorizontal: 15,
    },
    circle: {
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: "#000000",
        backgroundColor: "#ffffff",
        borderRadius: 15,
        marginBottom: 8,
        justifyContent: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
    },
    subTitle: {
        fontSize: 13,
        fontWeight: "600",
    },
})
