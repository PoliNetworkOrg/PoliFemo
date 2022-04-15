import React, { FC, useEffect, useState } from "react"
import { Text, Image } from "react-native"
import Icon from "react-native-vector-icons/AntDesign"

const [nome, setNome] = useState<string>()

export const ImageChange: FC<{ iconName?: string }> = props => {
    useEffect(() => {
        setNome(props.iconName ?? "")
    })

    return (
        <Image style={{ width: 50, height: 50 }} source={{ uri: nome ?? "" }} />
    )
}
