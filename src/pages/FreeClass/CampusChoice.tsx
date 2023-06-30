import { useContext, useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import buildingCoords from "components/FreeClass/buildingCoords.json"
import { ConstructionType } from "api/collections/rooms"
import { CampusItem, DefaultList } from "components/FreeClass/DefaultList"
import { ValidAcronym } from "utils/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"
import { PageWrap } from "components/PageLayout"

/**
 * In this page the user can select the campus.
 */
export const CampusChoice: MainStackScreen<"CampusChoice"> = props => {
  const { headquarter } = props.route.params

  const { date, setDate } = useContext(RoomsSearchDataContext)

  const [campusList, setCampusList] = useState<CampusItem[]>([])

  const getCampusList = (acronym: string) => {
    const tempCampusList: CampusItem[] = []
    for (const h of buildingCoords) {
      if (h.acronym === acronym) {
        for (const c of h.campus) {
          const campus: CampusItem = {
            type: ConstructionType.CAMPUS,
            name: c.name,
            acronym: h.acronym as ValidAcronym,
            latitude: c.latitude,
            longitude: c.longitude,
          }
          tempCampusList.push(campus)
        }
        break
      }
    }
    setCampusList(tempCampusList)
  }

  useEffect(() => getCampusList(headquarter.acronym), [])

  return (
    <PageWrap
      title={
        headquarter.name.length > 1
          ? [headquarter.name[0], headquarter.name[1]]
          : headquarter.name[0]
      }
    >
      <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      <DefaultList dataToShow={campusList} />
    </PageWrap>
  )
}
