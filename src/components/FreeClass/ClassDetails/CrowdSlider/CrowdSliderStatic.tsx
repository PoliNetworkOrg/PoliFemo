import React, { FC } from "react"
import { FlexAlignType, View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import Animated from "react-native-reanimated"

interface CrowdSliderStaticProps {
    position?: "basso" | "medio" | "alto"
}

export const CrowdSliderStatic: FC<CrowdSliderStaticProps> = props => {
    const { isLight } = usePalette()

    const getPos = (
        pos?: "basso" | "medio" | "alto"
    ): FlexAlignType | undefined => {
        if (pos === "basso") {
            return "flex-start"
        } else if (pos === "medio") {
            return "center"
        } else if (pos === "alto") {
            return "flex-end"
        }
        return undefined
    }

    return (
        <View>
            <View
                style={{
                    borderBottomWidth: 0.5,
                    width: "100%",
                    borderColor: isLight ? "#454773" : "#fff",
                    marginTop: 15,
                    marginBottom: 18,
                }}
            >
                <View
                    style={{
                        position: "absolute",
                        width: 28,
                        height: 28,
                        backgroundColor: "#D9D9D9",
                        borderRadius: 14,
                        top: -14,
                        alignSelf: getPos(props.position),
                    }}
                />
            </View>
        </View>
    )
}
