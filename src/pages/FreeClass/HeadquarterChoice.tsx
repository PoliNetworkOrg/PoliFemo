import { useContext, useEffect } from "react"
import { MainStackScreen } from "navigation/NavigationTypes"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { DefaultList, HeadquarterItem } from "components/FreeClass/DefaultList"
import { ConstructionType } from "api/collections/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"
import { useTranslation } from "react-i18next"
import { PageWrap } from "components/PageLayout"

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
  const { date, setDate } = useContext(RoomsSearchDataContext)

  const { t } = useTranslation("freeClass")

  useEffect(() => {
    setDate(new Date())
  }, [])

  return (
    <PageWrap title={t("freeClass_HQ") + ""}>
      <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      <DefaultList dataToShow={headquarterList} />
    </PageWrap>
  )
}
