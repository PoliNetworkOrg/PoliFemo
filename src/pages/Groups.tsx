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
import {
    filterByLanguage,
    msPassedBetween,
    orderByMostRecentYear,
} from "utils/groups"
import { wait } from "utils/functions"

const all = "Tutti"

const sleepTime = 500 //ms

export const Groups: MainStackScreen<"Groups"> = () => {
    //keep track of latest search request time (successful or not)
    const [lastSearchTime, setLastSearchTime] = useState<undefined | Date>(
        undefined
    )
    //for forcing api search request if needeed
    const [needSearching, setNeedSearching] = useState<boolean>(false)

    //for triggering api search request side effect (used in conjunction with `needSearching`)
    //reason : I want to trigger it only if I set needSearching to True, not to False
    const [rescheduleSearch, setRescheduleSearch] = useState<number>(0)

    //for triggering api request when user doesnt write in a time span of `sleepTime`
    //reason: I don't want to send api request on every character change.
    const [prevSearch, setPrevSearch] = useState("")

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

    //actually displayed groups (filtered by language)
    const [filteredGroups, setFilteredGroups] = useState<Group[] | undefined>(
        undefined
    )

    //tracking first render
    const isMounted = useMounted()

    /**
     * Api search request side effect.
     *
     * How this works (general ideas):
     * 1) gets called every time search text changes or rescheduleSearch is incremented (for forcing search request)
     * 2) if len(search) < 5 do nothing and delete stored groups if there are any.
     * 3) if no other searches were done before, send search request to api. Store time of search in `lastSearchTime`.
     * 4) successive requests are allowed if last search request time (successful or not) was more than `sleepTime` (500ms) ago
     * 5) if a request is not allowed, store `lastTimeSearch` anyway, then check `sleepTime` (500ms) later if the user has kept writing.
     * if he has, then do nothing because side effect will be called again, if he hasn't, then force search request with latest search value.
     */
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
                if (
                    msPassed === undefined ||
                    msPassed >= sleepTime ||
                    needSearching === true
                ) {
                    //update last time search
                    setLastSearchTime(now)
                    const response = await api.groups.get(
                        {
                            name: search.trimEnd(),
                            year: year === all ? undefined : year,
                            degree: course === all ? undefined : course,
                            type: type === all ? undefined : type,
                            platform: platform === all ? undefined : platform,
                        },
                        { maxRetries: 1, retryType: RetryType.RETRY_N_TIMES }
                    )
                    setGroups(response)
                    //reset need searching for next render
                    setNeedSearching(false)
                } else {
                    // ? over optimization maybe: this prevents api request if user keeps writing fast.
                    // ? maybe I should request every 1 seconds even if user is still writing? debatable
                    setLastSearchTime(now)
                    await wait(sleepTime)
                    //in the next render you have the previous and current search text, and can compare changes
                    //this triggers Reschedule Search Side Effect
                    setPrevSearch(search)
                }
            } catch (error) {
                console.log(error)
            }
        }
    }
    useEffect(() => {
        void searchGroups()
    }, [search, rescheduleSearch])

    /**
     * Reschedule Search Side Effect
     *
     * evaluate if user stopped writing characters in a time span of `sleepTime` seconds
     */
    useEffect(() => {
        if (isMounted) {
            if (prevSearch !== search) {
                //Do nothing
                return
            } else {
                //force search in next frame
                setRescheduleSearch(rescheduleSearch + 1)
                setNeedSearching(true)
            }
        }
    }, [prevSearch])

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
            let newGroups = groups

            if (year === all && newGroups) {
                newGroups = orderByMostRecentYear(newGroups)
            }
            if (language !== undefined && newGroups) {
                newGroups = filterByLanguage(newGroups, language)
            }
            setFilteredGroups(newGroups)
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
