import React, { FC } from "react"
import { View, StyleSheet, Pressable, Dimensions } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { deleteSvg as icon } from "assets/modal"
import Modal from "react-native-modal"
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
    onClose: () => void

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
    const deviceHeight = Dimensions.get("screen").height
    const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
        usePalette()
    const centerText = props.centerText ?? false
    const deleteSvg = useSVG(icon.svg)
    return (
        //TODO: animationType fade or slide?
        <Modal
            onBackButtonPress={props.onClose}
            statusBarTranslucent={true}
            isVisible={props.isShowing}
            animationIn={"slideInDown"}
            animationOut={"slideOutDown"}
            backdropColor={modalBarrier}
            deviceHeight={deviceHeight}
        >
            <Pressable onPress={props.onClose} style={[styles.pageWrapper]}>
                <View>
                    <Pressable
                        style={{ alignSelf: "flex-end" }}
                        onPress={() => props.onClose()}
                    >
                        <View style={styles.circle}>
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
                                { marginVertical: centerText ? 56 : 8 },
                            ]}
                        >
                            {props.subTitle}
                        </Text>
                        <View style={{ flex: 1 }}>{props.children}</View>
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
        width: 320,
        height: 420,
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
        marginHorizontal: 27,
        fontWeight: "900",
    },
    subTitle: {
        fontSize: 13,
        marginHorizontal: 27,
        fontWeight: "600",
    },
})
