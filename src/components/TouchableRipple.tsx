import React, { FC } from "react"
import { View, Pressable } from "react-native"
import { usePalette } from "utils/colors"

export interface TouchableRippleProps {
    onClick?: () => void
    isRoundedTopCorners?: boolean
    children: React.ReactNode
}

export const TouchableRipple: FC<TouchableRippleProps> = props => {
    const { isLight } = usePalette()
    return (
        <View
            // ? per qualche motivo ignoto ponendo borderRadius = undefined nel caso in cui non
            // ? ci debba essere borderRadius, il ripple effect fuorisce dalla view che wrappa
            // ? il Pressable (effetto indesiderato).
            // ? Sembra come se la View non si materializzi se non le viene dato
            // ? un certo stile che la modifica (come il borderRadius oppure il backgroundColor).
            // ? non sono sicuro di quest'ultima cosa, c'è anche la possibilità che abbia
            // ? fatto un errore da qualche parte :(
            style={{
                overflow: "hidden",
                borderTopLeftRadius: props.isRoundedTopCorners ? 30 : 0,
                borderTopRightRadius: props.isRoundedTopCorners ? 30 : 0,
            }}
        >
            <Pressable
                android_ripple={{
                    color: isLight ? "#d2d2d2" : "#343E5A",
                    borderless: true,
                }}
                style={{}}
                onPress={props.onClick ?? undefined}
            >
                {props.children}
            </Pressable>
        </View>
    )
}
