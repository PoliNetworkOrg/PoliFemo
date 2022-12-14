import React, { FC } from "react"
import { View, Modal, StyleSheet, Pressable } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { ButtonCustom } from "./ButtonCustom"

export interface ModalCustomSettingsProps {
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
    onClose: () => void

    /**
     * whether ot not to center title and subtitle and apply different margins
     * @default false
     */
    centerText?: boolean

    onOK: (value: string) => void

    selectedValue: string
}

/**
 * Custom Modal Component with two buttons at the bottom.
 *
 */
export const ModalCustomSettings: FC<ModalCustomSettingsProps> = props => {
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

                        {props.children}
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            marginBottom: 32,
                        }}
                    >
                        <ButtonCustom
                            light={true}
                            text={"Annulla"}
                            onPress={props.onClose}
                        />
                        <ButtonCustom
                            light={false}
                            text={"OK"}
                            onPress={() => {
                                props.onOK(props.selectedValue)
                            }}
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
        height: 320,
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
    title: {
        fontSize: 32,

        fontWeight: "900",
    },
    subTitle: {
        fontSize: 13,

        fontWeight: "600",
    },
})
