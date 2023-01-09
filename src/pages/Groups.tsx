import React, { useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Title } from "components/Text"
import { PoliSearchBar } from "components/Home"
import { Filters } from "components/Groups/Filters"
import { GroupsFiltered } from "components/Groups/GroupsFiltered"

export const Groups: MainStackScreen<"Groups"> = () => {
    const [search, setSearch] = useState("")

    const [isSearching, setIsSearching] = useState(false)
    return (
        <View style={{ flex: 1 }}>
            <ContentWrapperScroll marginTop={100}>
                <View style={{ paddingHorizontal: 26, paddingTop: 56 }}>
                    <Title>Gruppi Corsi</Title>
                    <PoliSearchBar
                        onChange={value => {
                            setSearch(value)
                            if (value !== "") {
                                setIsSearching(true)
                            } else if (isSearching === true) {
                                setIsSearching(false)
                            }
                        }}
                        style={{ marginTop: 46, marginBottom: 24 }}
                    />
                    {!isSearching ? (
                        <Filters />
                    ) : (
                        <GroupsFiltered string={search} />
                    )}
                </View>
            </ContentWrapperScroll>
        </View>
    )
}
