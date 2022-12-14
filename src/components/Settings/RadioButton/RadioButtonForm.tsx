import React, { FC } from "react"
import { View } from "react-native"
import { RadioButtonGroup } from "./RadioButtonContext"

export interface RadioButtonFormProps {
    children?: React.ReactNode
    showRipple?: boolean
    selectedValue: string
    setSelectedValue: React.Dispatch<React.SetStateAction<string>>
}

export const RadioButtonForm: FC<RadioButtonFormProps> = props => {
    return (
        <View>
            <RadioButtonGroup
                value={props.selectedValue}
                onValueChange={props.setSelectedValue}
            >
                {props.children}
            </RadioButtonGroup>
        </View>
    )
}
