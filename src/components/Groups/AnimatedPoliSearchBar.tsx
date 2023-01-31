import { PoliSearchBar } from "components/Home"
import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { AnimatedLine } from "./AnimatedLine"

export interface AnimatedPoliSearchBarProps {
    onSearch: (val: string) => void
    style?: ViewStyle
}

export const AnimatedPoliSearchBar: FC<AnimatedPoliSearchBarProps> = props => {
    const [isSearching, setIsSearching] = useState(false)
    return (
        <View style={props.style}>
            <PoliSearchBar
                onChange={val => {
                    props.onSearch(val)
                    if (val !== "") {
                        setIsSearching(true)
                    } else if (isSearching === true) {
                        setIsSearching(false)
                    }
                }}
                style={{ marginTop: 0, marginBottom: 0 }}
            />
            <AnimatedLine mounted={isSearching} />
        </View>
    )
}
