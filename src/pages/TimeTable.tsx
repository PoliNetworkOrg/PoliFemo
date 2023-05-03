import { MainStackScreen } from "navigation/NavigationTypes"
import { TimeTableGrid } from "components/TimeTable/TimeTableGrid"
import { PageWrapper } from "components/Groups/PageWrapper"

export const TimeTable: MainStackScreen<"TimeTable"> = () => {
  return (
    <PageWrapper marginTop={106}>
      <TimeTableGrid />
    </PageWrapper>
  )
}
