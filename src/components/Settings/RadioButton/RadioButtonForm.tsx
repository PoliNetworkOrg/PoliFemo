import React, { FC, useState } from "react"
import { View } from "react-native"
import { RadioButtonGroup } from "./RadioButtonContext"

export interface RadioButtonFormProps {
    children?: React.ReactNode
    showRipple?: boolean
}

export const RadioButtonForm: FC<RadioButtonFormProps> = props => {
    const [value, setValue] = useState(0)
    return (
        <View>
            <RadioButtonGroup value={value} onValueChange={setValue}>
                {props.children}
            </RadioButtonGroup>
        </View>
    )
}
