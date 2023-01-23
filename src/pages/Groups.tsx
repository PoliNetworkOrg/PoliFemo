import React, { useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Linking, ScrollView, View } from "react-native"
import { Title } from "components/Text"
import { Filters } from "components/Groups/Filters"
import { api, RetryType } from "api"
import { Group } from "api/groups"
import { useMounted } from "utils/useMounted"
import {
    createGroupLink,
    msPassedBetween,
    orderByMostRecentYear,
} from "utils/groups"
import { wait } from "utils/functions"
import { AnimatedPoliSearchBar } from "components/Groups/AnimatedPoliSearchBar"
import { GroupTile } from "components/Groups/GroupTile"
import { PageWrapper } from "components/Groups/PageWrapper"
import { ModalGroup } from "components/Groups/ModalGroup"
import { ModalGroupItem } from "components/Groups/ModalGroupItem"

const all = "Tutti"

const deltaTime = 500 //ms

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

    //for triggering api request when user doesnt write in a time span of `deltaTime`
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

    //actually displayed groups (Ordered by year)
    const [orderedGroups, setOrderedGroups] = useState<Group[] | undefined>(
        undefined
    )

    const [isModalShowing, setIsModalShowing] = useState(false)

    const [modalGroup, setModalGroup] = useState<Group | undefined>(undefined)

    //tracking first render
    const isMounted = useMounted()

    /**
     * Api search request side effect.
     *
     * How this works (general ideas):
     * 1) gets called every time search text changes or rescheduleSearch is incremented (for forcing search request)
     * 2) if len(search) < 5 do nothing and delete stored groups if there are any.
     * 3) if no other searches were done before, send search request to api. Store time of search in `lastSearchTime`.
     * 4) successive requests are allowed if last search request time (successful or not) was more than `deltaTime` (500ms) ago
     * 5) if a request is not allowed, store `lastTimeSearch` anyway, then check `deltaTime` (500ms) later if the user has kept writing.
     * if he has, then do nothing because side effect will be called again, if he hasn't,
     * then force search request with latest search value.
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
                    msPassed >= deltaTime ||
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
                    setLastSearchTime(now)
                    await wait(deltaTime)
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
     * evaluate if user stopped writing characters in a time span of `deltaTime` seconds
     */
    useEffect(() => {
        if (isMounted) {
            if (prevSearch !== search) {
                //Do nothing
                return
            } else {
                //force search in next frame
                forceSearch()
            }
        }
    }, [prevSearch])

    //if filters are applied after search, search again
    useEffect(() => {
        if (isMounted && groups) {
            forceSearch()
        }
    }, [course, year, type, platform])

    //load groups to Ordered groups every time a new response from api arrives.
    useEffect(() => {
        if (isMounted) {
            let newGroups = groups
            //if response from api arrives when we no longer expect it
            if (newGroups && search.length < 5) {
                newGroups = undefined
            }
            if (year === all && newGroups) {
                newGroups = orderByMostRecentYear(newGroups)
            }
            setOrderedGroups(newGroups)
        }
    }, [groups])

    //force search in next render
    const forceSearch = () => {
        setRescheduleSearch(rescheduleSearch + 1)
        setNeedSearching(true)
    }

    return (
        <PageWrapper>
            <View
                style={{
                    flex: 1,
                    marginHorizontal: 26,
                    paddingTop: 56,
                }}
            >
                <Title>Gruppi Corsi</Title>
                <AnimatedPoliSearchBar
                    isSearching={isSearching}
                    setIsSearching={val => setIsSearching(val)}
                    setSearch={val => setSearch(val)}
                    groups={orderedGroups}
                    style={{ marginTop: 36, marginBottom: 22 }}
                />
                <Filters
                    year={year}
                    setYear={val => setYear(val)}
                    course={course}
                    setCourse={val => setCourse(val)}
                    type={type}
                    setType={val => setType(val)}
                    platform={platform}
                    setPlatform={val => setPlatform(val)}
                    forceSearch={forceSearch}
                />

                <View
                    style={{
                        flex: 1,
                        marginTop: 40,
                        marginBottom: 93,
                    }}
                >
                    <ScrollView>
                        {orderedGroups?.map((group, idx) => {
                            return (
                                <GroupTile
                                    text={group.class}
                                    key={idx}
                                    onClick={() => {
                                        setModalGroup(group)
                                        setIsModalShowing(true)
                                    }}
                                />
                            )
                        })}
                    </ScrollView>
                </View>
                <ModalGroup
                    group={modalGroup}
                    isShowing={isModalShowing}
                    onClose={() => setIsModalShowing(false)}
                    onJoin={async (group?: Group) => {
                        if (!group?.link_id) {
                            return
                        }

                        const link = createGroupLink(
                            group.link_id,
                            group.platform
                        )
                        // Checking if the link is supported for links with custom URL scheme.
                        const supported = await Linking.canOpenURL(link)

                        if (supported) {
                            // Opening the link with some app
                            await Linking.openURL(link)
                        }
                    }}
                >
                    <ModalGroupItem group={modalGroup} />
                </ModalGroup>
            </View>
        </PageWrapper>
    )
}
