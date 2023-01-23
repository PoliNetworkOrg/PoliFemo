import { BodyText } from "components/Text"
import React, { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { Group } from "api/groups"

export interface ModalGroupItemProps {
    /**
     * ResetButton
     */
    group?: Group
}

export const ModalGroupItem: FC<ModalGroupItemProps> = props => {
    const { isLight } = usePalette()
    return (
        <View
            style={{
                alignItems: "center",
                marginHorizontal: 8,
            }}
        >
            <View
                style={{
                    width: 88,
                    height: 88,
                    backgroundColor: isLight ? "#454773" : "#fff",
                    borderRadius: 44,
                    marginTop: 16,
                    marginBottom: 8,
                }}
            />
            <BodyText
                style={{
                    fontSize: 32,
                    fontWeight: "900",
                    color: isLight ? "#414867" : "#fff",
                    textAlign: "center",
                }}
            >
                {props.group?.class}
            </BodyText>
            <View>
                <BodyText
                    style={{
                        fontSize: 13,
                        fontWeight: "400",
                        color: isLight ? "#8791BD" : "#fff",
                        textAlign: "center",
                    }}
                >
                    --:-- members, --:-- online
                </BodyText>
                <BodyText
                    style={{
                        fontSize: 13,
                        fontWeight: "400",
                        color: isLight ? "#414867" : "#fff",
                        textAlign: "center",
                        marginTop: 16,
                    }}
                >
                    {props.group?.year} {props.group?.platform}
                </BodyText>
            </View>
        </View>
    )
}
