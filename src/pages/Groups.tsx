import React, { useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { FlatList, Linking, View } from "react-native"
import { Title } from "components/Text"
import { Filters } from "components/Groups/Filters"
import { api, RetryType } from "api"
import { Group } from "api/groups"
import { useMounted } from "utils/useMounted"
import {
    choosePlatformIcon,
    createGroupLink,
    orderByMostRecentYear,
} from "utils/groups"

import { AnimatedPoliSearchBar } from "components/Groups/AnimatedPoliSearchBar"
import { GroupTile } from "components/Groups/GroupTile"
import { PageWrapper } from "components/Groups/PageWrapper"
import { ModalGroup } from "components/Groups/ModalGroup"
import { ModalGroupItem } from "components/Groups/ModalGroupItem"

const deltaTime = 100 //ms
let searchTimeout: NodeJS.Timeout

export const Groups: MainStackScreen<"Groups"> = () => {
    const [search, setSearch] = useState("")

    const [filters, setFilters] = useState<Filters>({})

    const [groups, setGroups] = useState<Group[]>([])

    const [isModalShowing, setIsModalShowing] = useState(false)

    const [modalGroup, setModalGroup] = useState<Group | undefined>(undefined)

    //tracking first render
    const isMounted = useMounted()

    /**
     * Api search request.
     */
    const searchGroups = async () => {
        if (isMounted) {
            if (search.length < 3) {
                setGroups([])
                return
            }
            try {
                //update last time search
                const response = await api.groups.get(
                    {
                        name: search.trimEnd(),
                        year: filters.year,
                        platform: filters.platform,
                        type: filters.type,
                        degree: filters.course,
                    },
                    { maxRetries: 1, retryType: RetryType.RETRY_N_TIMES }
                )
                setGroups(response)

                //reset need searching for next render
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        clearTimeout(searchTimeout)
        searchTimeout = setTimeout(() => {
            void searchGroups()
        }, deltaTime)
    }, [search])

    //if filters are applied after search, search again
    useEffect(() => {
        if (isMounted && groups) void searchGroups()
    }, [filters])

    const orderedGroups =
        filters.year === undefined ? orderByMostRecentYear(groups) : groups

    return (
        <PageWrapper>
            <View
                style={{
                    flex: 1,
                    marginHorizontal: 28,
                    paddingTop: 56,
                }}
            >
                <Title>Gruppi Corsi</Title>
                <AnimatedPoliSearchBar
                    onSearch={val => setSearch(val)}
                    style={{ marginTop: 36, marginBottom: 22 }}
                />
                <Filters
                    onFilterChange={filters => setFilters(filters)}
                    filters={filters}
                />

                <View
                    style={{
                        flex: 1,
                        marginTop: 40,
                        marginBottom: 93,
                        marginHorizontal: 8,
                    }}
                >
                    <FlatList
                        data={orderedGroups}
                        renderItem={group => (
                            <GroupTile
                                text={group.item.class}
                                members={group.item.members}
                                onClick={() => {
                                    setModalGroup(group.item)
                                    setIsModalShowing(true)
                                }}
                                icon={choosePlatformIcon(group.item.platform)}
                            />
                        )}
                        keyExtractor={item => item.id}
                    />
                </View>
            </View>
            <ModalGroup
                group={modalGroup}
                isShowing={isModalShowing}
                onClose={() => setIsModalShowing(false)}
                onJoin={async (group?: Group) => {
                    if (!group?.link_id) {
                        return
                    }

                    const link = createGroupLink(group.link_id, group.platform)
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
        </PageWrapper>
    )
}
