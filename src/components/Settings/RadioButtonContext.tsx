import { View } from "react-native"
import React from "react"

export interface RadioButtonGroupProps {
    /**
     * Function to execute on selection change.
     */
    onValueChange: React.Dispatch<React.SetStateAction<number>>
    /**
     * Value of the currently selected radio button.
     */
    value: number
    /**
     * React elements containing radio buttons.
     */
    children: React.ReactNode
}

export type RadioButtonContextType = {
    value: number
    onValueChange: React.Dispatch<React.SetStateAction<number>>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RadioButtonContext = React.createContext<RadioButtonContextType>({
    value: 0,
    onValueChange: () => {
        console.log("prova")
    },
})

export const RadioButtonGroup = ({
    value,
    onValueChange,
    children,
}: RadioButtonGroupProps) => (
    <RadioButtonContext.Provider
        value={{ value: value, onValueChange: onValueChange }}
    >
        <View accessibilityRole="radiogroup">{children}</View>
    </RadioButtonContext.Provider>
)
