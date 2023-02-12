import React, { FC, useMemo, useState } from "react"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { CrowdSliderStatic } from "./CrowdSlider/CrowdSliderStatic"
import { ModalCustom } from "components/Modal"
import { CrowdSliderDynamic } from "./CrowdSlider/CrowdSliderDynamic"
import { CrowdSliderLabels } from "./CrowdSlider/CrowdSliderLabels"
import { ButtonCustom } from "components/Settings"

interface CrowdingSectionProps {
    isSlidable?: boolean
    onSlided?: () => void
}

export const CrowdingSection: FC<CrowdingSectionProps> = props => {
    const { isLight } = usePalette()

    const [isModalVisible, setIsModalVisible] = useState(false)
    return (
        <View>
            <BodyText
                style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: isLight ? "#414867" : "#fff",
                    marginTop: 46,
                }}
            >
                Affollamento:
            </BodyText>
            <CrowdSliderStatic position="medio" />
            <CrowdSliderLabels />
            <View style={{ alignItems: "center", marginTop: 20 }}>
                <BodyText
                    style={{
                        fontSize: 13,
                        fontWeight: "400",
                        color: isLight ? "#454773" : "#fff",
                    }}
                >
                    Se il dato sull'affollamento non è corretto
                </BodyText>
                <Pressable hitSlop={8} onPress={() => setIsModalVisible(true)}>
                    <BodyText
                        style={{
                            fontSize: 13,
                            fontWeight: "900",
                            color: isLight ? "#454773" : "#fff",
                            textDecorationLine: "underline",
                        }}
                    >
                        esprimi opinione
                    </BodyText>
                </Pressable>
            </View>
            <ModalCustom
                title={`Esprimi\nOpinione`}
                subTitle={`Indica il livello di affollamento \n dell'aula`}
                isShowing={isModalVisible}
                onClose={() => setIsModalVisible(false)}
                centerText={true}
            >
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: 26,
                        flexDirection: "column",
                        justifyContent: "space-between",
                        marginBottom: 44,
                        marginTop: 72,
                    }}
                >
                    <BodyText
                        style={{
                            fontSize: 32,
                            fontWeight: "900",
                            color: isLight ? "#454773" : "#fff",
                            textAlign: "center",
                        }}
                    >
                        Esprimi{"\n"}Opinione
                    </BodyText>
                    <BodyText
                        style={{
                            fontSize: 13,
                            fontWeight: "900",
                            color: isLight ? "#454773" : "#fff",
                            textAlign: "center",
                        }}
                    >
                        Indica il livello di affollamento {"\n"} dell'aula
                    </BodyText>
                    <View style={{}}>
                        <CrowdSliderDynamic />
                        <CrowdSliderLabels />
                    </View>

                    <ButtonCustom
                        text="Conferma"
                        light={true}
                        style={{ alignSelf: "center" }}
                        onPress={() => console.log("press")}
                    />
                </View>
            </ModalCustom>
        </View>
    )
}
