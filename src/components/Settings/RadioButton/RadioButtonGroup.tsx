import { View } from "react-native"
import React, { FC } from "react"

export interface RadioButtonGroupProps {
    /**
     * Function to execute on selection change.
     */
    setValue: React.Dispatch<React.SetStateAction<string>>
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
    setValue: React.Dispatch<React.SetStateAction<string>>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RadioButtonContext = React.createContext<RadioButtonContextType>({
    value: "prova",
    setValue: () => {
        console.log("debug")
    },
})

export const RadioButtonGroup: FC<RadioButtonGroupProps> = props => {
    return (
        <RadioButtonContext.Provider
            value={{ value: props.value, setValue: props.setValue }}
        >
            <View>{props.children}</View>
        </RadioButtonContext.Provider>
    )
}
