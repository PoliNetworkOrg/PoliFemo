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
import { api, RetryType } from "api"
import { Group } from "api/groups"
import { useMounted } from "utils/useMounted"
import { filterByLanguage, msPassedBetween } from "utils/groups"
import { wait } from "utils/functions"

const all = "Tutti"

export const Groups: MainStackScreen<"Groups"> = () => {
    const [lastSearchTime, setLastSearchTime] = useState<undefined | Date>(
        undefined
    )

    const [needSearching, setNeedSearching] = useState<number>(0)

    const [search, setSearch] = useState("")

    const [isSearching, setIsSearching] = useState(false)

    // ? I'd like to typecheck year, course, etc... but I need dynamic type checking
    // ? and it's very ugly, and need to use type guards or some library, so maybe it is not worth it?
    const [year, setYear] = useState<string>(all)

    const [course, setCourse] = useState<string>(all)

    const [type, setType] = useState<string>(all)

    const [platform, setPlatform] = useState<string>(all)

    const [groups, setGroups] = useState<Group[] | undefined>(undefined)

    const [language, setLanguage] = useState<ValidLanguageType>()

    //when user selects "ITA" or "ENG"
    const [filteredGroups, setFilteredGroups] = useState<Group[] | undefined>(
        undefined
    )

    //tracking first render
    const isMounted = useMounted()

    //serch if len > 5 char and last search was more than 3000ms ago, if not search in (3000ms - time)ms
    //if the user doesnt search for something else
    const searchGroups = async () => {
        if (isMounted) {
            if (search.length < 5) {
                if (groups !== undefined) {
                    setGroups(undefined)
                }
                return
            }
            try {
                const now = new Date()
                const msPassed = msPassedBetween(lastSearchTime, now)
                if (msPassed === undefined || msPassed >= 3000) {
                    console.log("searching")
                    setLastSearchTime(now)
                    const response = await api.groups.get(
                        {
                            name: search,
                            year: year === all ? undefined : year,
                            degree: course === all ? undefined : course,
                            type: type === all ? undefined : type,
                            platform: platform === all ? undefined : platform,
                        },
                        { maxRetries: 1, retryType: RetryType.RETRY_N_TIMES }
                    )
                    console.log("response arrived")
                    setGroups(response)
                } else {
                    console.log(msPassed + " passsed, reschedule research")
                    await researchIn(3000 - msPassed)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        void searchGroups()
    }, [search, needSearching])

    /**
     * reserach in (3000 - time) ms if search string doesnt change in this span of time.
     * Fired every time a search is canceled because it didnt pass enough time from last search.
     **/
    const researchIn = async (time: number) => {
        const prevSearch = search
        const prevNeedSearching = needSearching
        await wait(time)
        // ! not working properly
        if (prevSearch === search && prevNeedSearching === needSearching) {
            setNeedSearching(needSearching + 1)
            console.log("research fired!!")
        }
    }

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
