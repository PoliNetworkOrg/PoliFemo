import React, { FC } from "react"
import { View, Modal, StyleSheet, Pressable, ScrollView } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { deleteSvg as icon } from "assets/modal"
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
    const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
        usePalette()
    const centerText = props.centerText ?? false
    const deleteSvg = useSVG(icon.svg)
    return (
        //TODO: animationType fade or slide?
        <Modal
            onRequestClose={props.onClose}
            statusBarTranslucent={true}
            visible={props.isShowing}
            animationType="fade"
            transparent={true}
            style={{}}
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
                        <ScrollView>{props.children}</ScrollView>
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
