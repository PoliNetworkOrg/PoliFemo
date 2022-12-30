import React, { FC } from "react"
import { View } from "react-native"
import { TouchableRipple } from "components/TouchableRipple"
import { ButtonCustom } from "./ButtonCustom"
import { CareerColumn } from "./CareerColumn"
import { Career } from "utils/user"

export interface CareerTileProps {
    career: Career
    onPress: () => void
}

/**
 * Custom Tile component designed to show a "University Career"
 * and a button to open a modal.
 */
export const CareerTile: FC<CareerTileProps> = props => {
    return (
        <TouchableRipple>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingVertical: 16,
                    paddingLeft: 28,
                    paddingRight: 46,
                }}
            >
                <ButtonCustom
                    onPress={props.onPress}
                    text={"Cambia matricola"}
                    buttonStyle={{ paddingHorizontal: 8 }}
                />
                <CareerColumn career={props.career}></CareerColumn>
            </View>
        </TouchableRipple>
    )
}
