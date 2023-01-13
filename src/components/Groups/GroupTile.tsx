import { BodyText } from "components/Text"
import React, { FC } from "react"
import { Linking, Pressable } from "react-native"
import { usePalette } from "utils/colors"

export interface GroupTileProps {
    name?: string
    link?: string
}

export const GroupTile: FC<GroupTileProps> = props => {
    const { isLight } = usePalette()

    const handlePress = async () => {
        if (!props.link) {
            return
        }
        // Checking if the link is supported for links with custom URL scheme.
        const supported = await Linking.canOpenURL(props.link)

        if (supported) {
            // Opening the link with some app, if the URL scheme is "http" the web link should be opened
            // by some browser in the mobile
            await Linking.openURL(props.link)
        }
    }

    return (
        <Pressable onPress={handlePress} style={{ marginBottom: 20 }}>
            <BodyText
                style={{ fontSize: 13, color: isLight ? "#424967" : "#fff" }}
            >
                {props.name}
            </BodyText>
        </Pressable>
    )
}
