import React, { FC, useState } from "react"
import { Image, Pressable } from "react-native"

export const ImageChange: FC<{
    imageURLs: string[]
}> = props => {
    const [imageURL, setImageURL] = useState(props.imageURLs[0])
    return (
        <Pressable
            onPress={() => {
                setImageURL(
                    props.imageURLs[
                        Math.floor(Math.random() * props.imageURLs.length)
                    ]
                )
            }}
        >
            <Image
                style={{ width: 150, height: 150, resizeMode: "contain" }}
                source={{
                    uri: imageURL,
                }}
            />
        </Pressable>
    )
}
