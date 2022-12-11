import React, { FC, useState } from "react"
import { View, ScrollView } from "react-native"

import { Carriera } from "./User"
import { CarrieraTile } from "./FormCarriereTile"
import { RadioButtonGroup } from "./RadioButtonContext"

export interface FormCarriereProps {
    carriere?: Carriera[]
}

export const FormCarriere: FC<FormCarriereProps> = props => {
    const carriere = props.carriere

    const [value, setValue] = useState(0)
    return (
        <View>
            <RadioButtonGroup value={value} onValueChange={setValue}>
                <ScrollView scrollEnabled={false}>
                    {carriere?.map((carriera, index) => {
                        return (
                            <CarrieraTile
                                key={index}
                                matricola={carriera.matricola}
                                type={carriera.type}
                                index={index}
                            ></CarrieraTile>
                        )
                    })}
                </ScrollView>
            </RadioButtonGroup>
        </View>
    )
}
