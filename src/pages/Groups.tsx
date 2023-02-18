import React, { useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { FlatList, Linking, View } from "react-native"
import { Title } from "components/Text"
import { Filters } from "components/Groups/Filters"
import { api } from "api"
import { Group } from "api/groups"
import { useMounted } from "utils/useMounted"
import {
  applyFilters,
  choosePlatformIcon,
  createGroupLink,
  orderByMostRecentYear,
  searchGroups,
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

  const [filteredGroups, setFilteredGroups] = useState<Group[]>([])

  const [searchableGroups, setSearchableGroups] = useState<Group[]>([])

  const [isModalShowing, setIsModalShowing] = useState(false)

  const [modalGroup, setModalGroup] = useState<Group | undefined>(undefined)

  //tracking first render
  const isMounted = useMounted()

  const getGroups = async () => {
    try {
      const res = await api.groups.getFromGithub()
      setGroups(res)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    void getGroups()
  }, [])

  useEffect(() => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      if (search.trimEnd().length > 2) {
        const newGroups = searchGroups(filteredGroups, search)
        setSearchableGroups(newGroups)
      } else {
        setSearchableGroups([])
      }
    }, deltaTime)
  }, [search, filteredGroups])

  //if filters are applied after search, search again
  useEffect(() => {
    if (isMounted && groups) {
      const newGroups = applyFilters(groups, filters)
      setFilteredGroups(newGroups)
    }
  }, [filters, groups])

  const orderedGroups =
    filters.year === undefined
      ? orderByMostRecentYear(searchableGroups)
      : searchableGroups

  return (
    <PageWrapper>
      <View style={{ paddingHorizontal: 28, paddingTop: 56 }}>
        <Title>Gruppi Corsi</Title>
        <AnimatedPoliSearchBar
          onSearch={val => setSearch(val)}
          style={{ marginTop: 36, marginBottom: 22 }}
        />
        <Filters
          onFilterChange={filters => setFilters(filters)}
          filters={filters}
        />
      </View>
      <FlatList
        style={{
          flex: 1,
          marginTop: 16,
          marginBottom: 93,
          paddingHorizontal: 8,
        }}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
        data={orderedGroups}
        renderItem={({ item }) => (
          <GroupTile
            key={"__search_group_tile_" + item.id}
            text={item.class ?? "No Name"}
            members={item.members}
            onClick={() => {
              setModalGroup(item)
              setIsModalShowing(true)
            }}
            icon={choosePlatformIcon(item.platform)}
          />
        )}
      />
      <ModalGroup
        group={modalGroup}
        isShowing={isModalShowing}
        onClose={() => setIsModalShowing(false)}
        onJoin={async (group?: Group) => {
          if (!group?.id_link) {
            return
          }

          const link = createGroupLink(group.id_link, group.platform)
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
