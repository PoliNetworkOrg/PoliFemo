import { useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { FlatList, Linking, View } from "react-native"
import { Title } from "components/Text"
import { FiltersList } from "components/Groups/FiltersList"
import { api } from "api"
import { Group } from "api/collections/groups"
import { useMounted } from "utils/useMounted"
import {
  applyFilters,
  choosePlatformIcon,
  createGroupLink,
  Filters,
  orderByMostRecentYear,
  searchGroups,
} from "utils/groups"

import { GroupTile } from "components/Groups/GroupTile"
import { PageWrapper } from "components/Groups/PageWrapper"
import { ModalGroup } from "components/Groups/ModalGroup"
import { PoliSearchBar } from "components/Home/PoliSearchBar"

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

  //Request groups from Github
  useEffect(() => {
    void getGroups()
  }, [])

  //Apply filters
  useEffect(() => {
    if (isMounted && groups) {
      const newGroups = applyFilters(groups, filters)
      setFilteredGroups(newGroups)
    }
  }, [filters, groups])

  //Search among filtered groups
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

  const orderedGroups =
    filters.year === undefined
      ? orderByMostRecentYear(searchableGroups)
      : searchableGroups

  return (
    <PageWrapper>
      <View style={{ paddingHorizontal: 28, paddingTop: 56 }}>
        <Title>Gruppi Corsi</Title>
        <View style={{ marginTop: 36, marginBottom: 22 }}>
          <PoliSearchBar
            onChange={val => {
              setSearch(val)
            }}
            style={{ marginTop: 0, marginBottom: 0 }}
          />
        </View>
        <FiltersList
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
      {modalGroup && (
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
        />
      )}
    </PageWrapper>
  )
}
