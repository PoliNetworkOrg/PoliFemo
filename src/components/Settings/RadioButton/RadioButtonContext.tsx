import { View } from "react-native"
import React from "react"

export interface RadioButtonGroupProps {
    /**
     * Function to execute on selection change.
     */
    onValueChange: React.Dispatch<React.SetStateAction<string>>
    /**
     * Value of the currently selected radio button.
     */
    value: string
    /**
     * React elements containing radio buttons.
     */
    children: React.ReactNode
}

export type RadioButtonContextType = {
    value: string
    onValueChange: React.Dispatch<React.SetStateAction<string>>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RadioButtonContext = React.createContext<RadioButtonContextType>({
    value: "prova",
    onValueChange: () => {
        console.log("debug")
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
        <View>{children}</View>
    </RadioButtonContext.Provider>
)
