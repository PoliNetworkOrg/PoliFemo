import React, { useEffect, useState } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { View } from "react-native"
import { Title } from "components/Text"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"
import { DefaultList } from "components/FreeClass/DefaultList"
import { ConstructionType } from "api/rooms"
import { CampusItem } from "./CampusChoice"

export interface HeadquarterItem {
  type: ConstructionType
  acronym: string
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
  { type: ConstructionType.HEADQUARTER, acronym: "MIC", name: ["Residenze"] },
  {
    type: ConstructionType.HEADQUARTER,
    acronym: "MID",
    name: ["Sesto", "Ulteriano"],
  },
  { type: ConstructionType.HEADQUARTER, acronym: "COE", name: ["Como"] },
]

/**
 * In this page the user can select the campus.
 */
export const HeadquarterChoice: MainStackScreen<
  "HeadquarterChoice"
> = props => {
  const { currentDate } = props.route.params

  //non-ISO format for simplicity (local timezone) and
  // compatibility with `handleConfirm` function
  const [date, setDate] = useState<Date>(
    new Date(currentDate) !== new Date() ? new Date(currentDate) : new Date()
  )

  useEffect(() => {
    setDate(new Date(currentDate))
  }, [props.route.params.currentDate])

  return (
    <PageWrapper style={{ marginTop: 106 }}>
      <View style={{ paddingTop: 28 }}>
        <Title style={{ paddingLeft: 28 }}>Sede</Title>
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      <DefaultList dataToShow={headquarterList} currentDate={date} />
    </PageWrapper>
  )
}
