import React, { FC } from "react"
import { Text as _Text, TextProps } from "react-native"

import { usePalette } from "utils/colors"

/**
 * Title used for the Page component, custom font, default size and automatic color.
 */
export const Title: FC<TextProps> = props => {
    const { primary } = usePalette()
    const { style, children } = props
    return (
        <_Text
            {...props}
            style={[
                {
                    fontFamily: "Roboto_700Bold",
                    fontSize: 48,
                    color: primary,
                },
                style,
            ]}
        >
            {children}
        </_Text>
    )
}
