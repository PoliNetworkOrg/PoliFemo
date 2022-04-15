import React, { FC, useEffect, useState } from "react"
import { Image } from "react-native"

const [nome, setNome] = useState<string>()

export const ImageChange: FC<{ iconName?: string }> = props => {
    useEffect(() => {
        setNome(props.iconName ?? "")
    })

    return (
        <Image style={{ width: 50, height: 50 }} source={{ uri: nome ?? "" }} />
    )
}
