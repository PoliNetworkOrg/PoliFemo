import { Group } from "api/groups"
import { PoliSearchBar } from "components/Home"
import React, { FC } from "react"
import { View, ViewStyle } from "react-native"
import { AnimatedLine } from "./AnimatedLine"


export interface AnimatedPoliSearchBarProps {
    setSearch: (val: string) => void
    isSearching: boolean
    setIsSearching: (val: boolean) => void
    groups?: Group[]
    style?: ViewStyle
}

export const AnimatedPoliSearchBar: FC<
    AnimatedPoliSearchBarProps
> = props => {

    return (
        <View style={props.style}>
            <PoliSearchBar
                onChange={val => {
                    props.setSearch(val)
                    if (val !== "") {
                        props.setIsSearching(true)
                    } else if (props.isSearching === true) {
                        props.setIsSearching(false)
                    }
                }}
                style={{ marginTop: 0, marginBottom: 0 }}
            />
            <AnimatedLine mounted={props.isSearching} />
        </View>
    )
}
