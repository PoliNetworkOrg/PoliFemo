import { useContext, useEffect } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { Title } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"
import { DefaultList } from "components/FreeClass/DefaultList"
import { ConstructionType } from "api/rooms"
import { CampusItem } from "./CampusChoice"
import { ValidAcronym } from "utils/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"

export interface HeadquarterItem {
  type: ConstructionType
  acronym: ValidAcronym
  name: string[]
  campusList?: CampusItem[]
}

const headquarterList: HeadquarterItem[] = [
  {
    type: ConstructionType.HEADQUARTER,
    acronym: "MIA",
    name: ["Milano", "Città Studi"],
  },
  {
    type: ConstructionType.HEADQUARTER,
    acronym: "MIB",
    name: ["Milano", "Bovisa"],
  },
  { type: ConstructionType.HEADQUARTER, acronym: "CRG", name: ["Cremona"] },
  { type: ConstructionType.HEADQUARTER, acronym: "LCF", name: ["Lecco"] },
  { type: ConstructionType.HEADQUARTER, acronym: "PCL", name: ["Piacenza"] },
  { type: ConstructionType.HEADQUARTER, acronym: "MNI", name: ["Mantova"] },
]

/**
 * In this page the user can select the campus.
 */
export const HeadquarterChoice: MainStackScreen<"HeadquarterChoice"> = () => {
  const { date, setDate, setAcronym } = useContext(RoomsSearchDataContext)

  useEffect(() => {
    setDate(new Date())
  }, [])

  return (
    <PageWrapper>
      <View style={{ paddingTop: 28 }}>
        <Title style={{ paddingLeft: 28 }}>Sede</Title>
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      <DefaultList dataToShow={headquarterList} setAcronym={setAcronym} />
    </PageWrapper>
  )
}
