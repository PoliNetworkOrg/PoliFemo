import { Group } from "api/groups"
import { PoliSearchBar } from "components/Home"
import React, { FC } from "react"
import { ScrollView, View, ViewStyle } from "react-native"
import { usePalette } from "utils/colors"
import { createGroupLink } from "utils/groups"
import { AnimatedLine } from "./AnimatedLine"
import { GroupTile } from "./GroupTile"
import { OutlinedButton } from "./OutlinedButton"

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
    const { isLight } = usePalette()

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
