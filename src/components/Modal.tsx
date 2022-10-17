import React, { FC } from "react"
import { View, Modal, StyleSheet, Text, Pressable } from "react-native"

import { usePalette } from "utils/colors"

export interface ModalCustomProps {
    title: string
    subTitle?: string
    /**
     * whether ot not to show the modal
     */
    isShowing: boolean
    /**
     * content of the modal
     */
    children: JSX.Element
    /**
     * this function hides the modal by changing the state in the parent component
     */
    toggleModal: () => void
}

/**
 * custom modal component
 *
 */

export const ModalCustom: FC<ModalCustomProps> = props => {
    const { backgroundSecondary, homeBackground, modalBarrier, isLight } =
        usePalette()

    return (
        //TODO: animationType?
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
                            <Text
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                X
                            </Text>
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
                            ]}
                        >
                            {props.title}
                        </Text>
                        <Text
                            style={[
                                styles.subTitle,
                                { color: isLight ? homeBackground : "#ffffff" },
                            ]}
                        >
                            {props.subTitle}
                        </Text>
                        {/* <ScrollView
                            horizontal
                            contentContainerStyle={{
                                marginTop: 32,
                                flex: 1,
                                flexDirection: "row",
                                flexWrap: "wrap",
                            }}
                        >
                            {props.iconNames.map(p => (
                                <MenuButton
                                    onPress={() => console.log("added")}
                                    title={p}
                                    key={"menu_" + p}
                                />
                            ))}
                        </ScrollView> */}
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
        textAlign: "left",
        paddingTop: 36,
        fontSize: 32,

        fontWeight: "900",
    },
    subTitle: {
        textAlign: "left",
        paddingTop: 16,
        fontSize: 13,

        fontWeight: "600",
    },
})
