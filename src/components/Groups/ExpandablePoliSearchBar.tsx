import { MockedGroup } from "api/groups"
import { PoliSearchBar } from "components/Home"
import React, { FC, useState } from "react"
import { ScrollView, View } from "react-native"
import { usePalette } from "utils/colors"
import { AnimatedLine } from "./AnimatedLine"
import { GroupTile } from "./GroupTile"
import { OutlinedButton } from "./OutlinedButton"

export interface ExpandablePoliSearchBarProps {
    setSearch: (val: string) => void
    isSearching: boolean
    setIsSearching: (val: boolean) => void
    groups?: MockedGroup[]
    language: ValidLanguageType
    setLanguage: (val: ValidLanguageType) => void
}

export type ValidLanguageType = "ITA" | "ENG" | undefined

export const ExpandablePoliSearchBar: FC<
    ExpandablePoliSearchBarProps
> = props => {
    const { isLight } = usePalette()

    return (
        <View
            style={{
                justifyContent: "center",
                flexDirection: "row",
            }}
        >
            <View
                style={{
                    backgroundColor: props.isSearching
                        ? isLight
                            ? "#F6F7FC"
                            : "#343E5A"
                        : "transparent",
                    marginTop: 46,
                    marginBottom: 24,
                    height: props.isSearching ? 268 : undefined,
                    borderBottomRightRadius: 8,
                    borderBottomLeftRadius: 8,
                    borderTopRightRadius: 28,
                    borderTopLeftRadius: 28,
                }}
            >
                <PoliSearchBar
                    onChange={val => {
                        props.setSearch(val)
                        if (val !== "") {
                            props.setIsSearching(true)
                        } else if (props.isSearching === true) {
                            props.setIsSearching(false)
                            props.setLanguage(undefined)
                        } else {
                            props.setLanguage(undefined)
                        }
                    }}
                    style={{ marginTop: 0, marginBottom: 0 }}
                />
                <AnimatedLine mounted={props.isSearching} />

                {props.groups && props.isSearching && (
                    <View
                        style={{
                            paddingHorizontal: 16,
                            paddingVertical: 16,
                            height: 230,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-around",
                                paddingBottom: 16,
                            }}
                        >
                            <OutlinedButton
                                text="Ita"
                                isSelected={props.language === "ITA"}
                                onPress={() => {
                                    if (props.language === "ITA") {
                                        props.setLanguage(undefined)
                                    } else {
                                        props.setLanguage("ITA")
                                    }
                                }}
                            />
                            <OutlinedButton
                                text="Eng"
                                isSelected={props.language === "ENG"}
                                onPress={() => {
                                    if (props.language === "ENG") {
                                        props.setLanguage(undefined)
                                    } else {
                                        props.setLanguage("ENG")
                                    }
                                }}
                            />
                        </View>
                        <ScrollView>
                            {props.groups.map((group, idx) => {
                                return (
                                    <GroupTile
                                        name={group.name}
                                        link={group.idLink}
                                        key={idx}
                                    />
                                )
                            })}
                        </ScrollView>
                    </View>
                )}
            </View>
        </View>
    )
}
