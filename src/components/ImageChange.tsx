import React, { FC, useState } from "react"
import { Image, Pressable } from "react-native"

export const ImageChange: FC<{
    imageURL?: string[]
}> = props => {
    const [ImageURL, setImageURL] = useState<string>()
    return (
        <Pressable
            onPress={() => {
                setImageURL(
                    props.imageURL == undefined
                        ? undefined
                        : props.imageURL[
                              Math.floor(Math.random() * props.imageURL?.length)
                          ]
                )
            }}
        >
            <Image
                style={{ width: 150, height: 150, resizeMode: "contain" }}
                source={{
                    uri:
                        ImageURL == undefined
                            ? props.imageURL == undefined
                                ? undefined
                                : props.imageURL[0]
                            : ImageURL ?? "",
                }}
            />
        </Pressable>
    )
}
