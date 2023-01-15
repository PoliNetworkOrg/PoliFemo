import React, { useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"
import { Title } from "components/Text"
import { Filters } from "components/Groups/Filters"
import {
    ExpandablePoliSearchBar,
    ValidLanguageType,
} from "components/Groups/ExpandablePoliSearchBar"
import { api } from "api"
import { MockedGroup } from "api/groups"
import { useMounted } from "utils/useMounted"
import { filterByLanguage } from "utils/groups"

const all = "Tutti"

export const Groups: MainStackScreen<"Groups"> = () => {
    const [search, setSearch] = useState("")

    const [isSearching, setIsSearching] = useState(false)

    // ? I'd like to typecheck year, course, etc... but I need dynamic type checking
    // ? and it's very ugly, and need to use type guards or some library, so maybe it is not worth it?
    const [year, setYear] = useState<string>(all)

    const [course, setCourse] = useState<string>(all)

    const [type, setType] = useState<string>(all)

    const [platform, setPlatform] = useState<string>(all)

    const [groups, setGroups] = useState<MockedGroup[] | undefined>(undefined)

    const [language, setLanguage] = useState<ValidLanguageType>()

    //when user selects "ITA" or "ENG"
    const [filteredGroups, setFilteredGroups] = useState<
        MockedGroup[] | undefined
    >(undefined)

    //tracking first render
    const isMounted = useMounted()

    //api call every time user enter a new character
    const searchGroups = () => {
        if (isMounted) {
            try {
                //mocked
                const response = api.groups.getMocked()
                console.log(response)
                setGroups(response)
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        void searchGroups()
    }, [search])

    //filter items every time selected language changes
    useEffect(() => {
        if (isMounted && groups) {
            if (language) {
                const newFilteredGroups = filterByLanguage(groups, language)
                setFilteredGroups(newFilteredGroups)
            } else {
                resetFilterLanguage()
            }
        }
    }, [language])

    //load groups to filtered groups every time a new response from api arrives. (language filters ignored)
    useEffect(() => {
        if (isMounted) {
            setFilteredGroups(groups)
        }
    }, [groups])

    //helper function to reset language filters
    const resetFilterLanguage = () => {
        setFilteredGroups(groups)
    }
    return (
        <View style={{ flex: 1 }}>
            <ContentWrapperScroll marginTop={100}>
                <View style={{ paddingHorizontal: 26, paddingTop: 56 }}>
                    <Title>Gruppi Corsi</Title>
                    <ExpandablePoliSearchBar
                        isSearching={isSearching}
                        setIsSearching={val => setIsSearching(val)}
                        setSearch={val => setSearch(val)}
                        groups={filteredGroups}
                        language={language}
                        setLanguage={val => setLanguage(val)}
                    />

                    {!isSearching && (
                        <Filters
                            year={year}
                            setYear={val => setYear(val)}
                            course={course}
                            setCourse={val => setCourse(val)}
                            type={type}
                            setType={val => setType(val)}
                            platform={platform}
                            setPlatform={val => setPlatform(val)}
                        />
                    )}
                </View>
            </ContentWrapperScroll>
        </View>
    )
}
