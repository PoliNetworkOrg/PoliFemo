import { useContext, useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { Title } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"
import buildingCoords from "components/FreeClass/buildingCoords.json"
import { ConstructionType } from "api/rooms"
import { DefaultList } from "components/FreeClass/DefaultList"
import { ValidAcronym } from "utils/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"

export interface CampusItem {
  type: ConstructionType
  name: string[]
  acronym: ValidAcronym
  latitude: number
  longitude: number
}

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
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            latitude: c.latitude,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
    <PageWrapper style={{ marginTop: 106 }}>
      <View style={{ paddingTop: 28 }}>
        {headquarter.name.length > 1 ? (
          <Title
            style={{
              paddingLeft: 28,
              fontWeight: "300",
              fontFamily: "Roboto_300Light",
            }}
          >
            {headquarter.name[0]}
            <Title>{" " + headquarter.name[1]}</Title>
          </Title>
        ) : (
          <Title style={{ paddingLeft: 28 }}>{headquarter.name}</Title>
        )}
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      <DefaultList dataToShow={campusList} />
    </PageWrapper>
  )
}
