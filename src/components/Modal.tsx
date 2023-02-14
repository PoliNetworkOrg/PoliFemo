import React, { FC } from "react"
import { View, Modal, StyleSheet, Pressable } from "react-native"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { deleteSvg as icon } from "assets/modal"
export interface ModalCustomProps {
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
 * custom modal component
 *
 */
export const ModalCustom: FC<ModalCustomProps> = props => {
    const { backgroundSecondary, modalBarrier } = usePalette()

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
                        <View style={{ width: 320, height: 420 }}>
                            {props.children}
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
