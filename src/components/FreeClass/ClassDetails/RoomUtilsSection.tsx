import React, { FC, useMemo } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"
import { RoomUtilsTile } from "./RoomUtilsTile"


interface RoomUtilsSectionProps {
    power?: boolean
    computers?: boolean
    ribaltine?: boolean
}

export const RoomUtilsSection: FC<RoomUtilsSectionProps> = props => {
    const { isLight } = usePalette()

    return (
        <View>
            <BodyText
                style={{
                    fontSize: 20,
                    fontWeight: "900",
                    color: isLight ? "#414867" : "#fff",
                }}
            >
                Info Utili:
            </BodyText>
            <RoomUtilsTile
                name="ribaltine/banco piccolo"
                status={props.ribaltine}
            />
            <RoomUtilsTile
                name="prese per ogni postazione"
                status={props.power}
            />
            <RoomUtilsTile
                name="aula informatizzata"
                status={props.computers}
            />
        </View>
    )
}
