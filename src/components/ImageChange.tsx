import React, { FC, useState } from "react"
import { Image, Pressable } from "react-native"

export const ImageChange: FC<{
    imageURLs: string[]
}> = props => {
    const [imageURL, setImageURL] = useState(props.imageURLs[0])
    return (
        <Pressable
            onPress={() => {
                if (props.imageURLs.length <= 1) return
                else {
                    const otherPictures = props.imageURLs.filter(
                        v => v !== imageURL
                    )
                    setImageURL(
                        otherPictures[
                            Math.floor(Math.random() * otherPictures.length)
                        ]
                    )
                }
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
