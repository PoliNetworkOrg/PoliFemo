import { useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { Linking, View } from "react-native"
import { FiltersList } from "components/Groups/FiltersList"
import { api } from "api"
import { Group } from "api/collections/groups"
import {
  applyFilters,
  choosePlatformIcon,
  createGroupLink,
  Filters,
  orderByMostRecentYear,
  searchGroups,
} from "utils/groups"

import { GroupTile } from "components/Groups/GroupTile"
import { ModalGroup } from "components/Groups/ModalGroup"
import { PoliSearchBar } from "components/Home/PoliSearchBar"
import { useTranslation } from "react-i18next"
import { useApiCall } from "api/useApiCall"
import { ListPage } from "components/PageLayout/ListPage"

const deltaTime = 100 //ms
let searchTimeout: NodeJS.Timeout

export const Groups: MainStackScreen<"Groups"> = () => {
  const { t } = useTranslation()

  const [search, setSearch] = useState("")

  const [filters, setFilters] = useState<Filters>({})

  const [groups] = useApiCall(api.groups.getFromGithub, {}, [])
  const filteredGroups = applyFilters(groups, filters)

  const [searchableGroups, setSearchableGroups] = useState<Group[]>([])

  const [isModalShowing, setIsModalShowing] = useState(false)

  const [modalGroup, setModalGroup] = useState<Group | undefined>(undefined)

  //Search among filtered groups
  useEffect(() => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      const newGroups = searchGroups(filteredGroups, search)
      setSearchableGroups(newGroups)
    }, deltaTime)
  }, [search, filteredGroups])

  const orderedGroups =
    filters.year === undefined
      ? orderByMostRecentYear(searchableGroups)
      : searchableGroups

  return (
    <>
      <ListPage
        title={t("groups_title")}
        headerComponent={
          <>
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
          </>
        }
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
    </>
  )
}
