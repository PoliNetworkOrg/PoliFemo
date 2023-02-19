import React, { FC } from "react"
import { View, StyleSheet, ViewStyle, Dimensions } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { ButtonCustom } from "./ButtonCustom"
import Modal from "react-native-modal"
import { Portal } from "react-native-portalize"
export interface ModalSelectionProps {
    /**
     * content of the modal
     */
    children: React.ReactNode

    title: string

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

    animationTiming?: number

    /**override center container's style, for example changing height */
    style?: ViewStyle
}

// ? maybe should move this out of Settings folder ?

/**
 * Custom Modal Component with two buttons at the bottom.
 *
 */
export const ModalSelection: FC<ModalSelectionProps> = props => {
    const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
        usePalette()
    const deviceHeight = Dimensions.get("screen").height
    return (
        <Portal>
            <Modal
                onBackButtonPress={props.onClose}
                statusBarTranslucent={true}
                isVisible={props.isShowing}
                animationIn={"fadeIn"}
                animationOut={"fadeOut"}
                backdropColor={modalBarrier}
                deviceHeight={deviceHeight}
                coverScreen={false}
                // TODO: animation timing?
                animationInTiming={props.animationTiming ?? 100}
                animationOutTiming={props.animationTiming ?? 100}
                onBackdropPress={props.onClose}
                useNativeDriverForBackdrop={true}
                useNativeDriver={true}
            >
                <View style={[styles.pageWrapper]}>
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
                                text={"Annulla"}
                                onPress={props.onClose}
                            />
                            <ButtonCustom
                                light={false}
                                text={"OK"}
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
