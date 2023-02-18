import { MainStackScreen } from "navigation/NavigationTypes"
import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { Title } from "components/Text"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"

/**
 * In this page the user can select finally the free class he wants.
 */
export const ClassChoice: MainStackScreen<"ClassChoice"> = props => {
  const { building, currentDate } = props.route.params

  //non-ISO format for simplicity (local timezone) and
  // compatibility with `handleConfirm` function
  const [date, setDate] = useState<Date>(
    new Date(currentDate) !== new Date() ? new Date(currentDate) : new Date()
  )

  useEffect(() => {
    setDate(new Date(currentDate))
  }, [props.route.params.currentDate])

  //custom goBack function in order to maintain the currenyDate
  const goBack = () => {
    props.navigation.navigate("BuildingChoice", {
      campus: building.campus,
      currentDate: date.toString(),
    })
  }

  const buildingName: string[] = building.name.split(" ") // ex. buildingName = ["Ed.","B2"]

  return (
    <PageWrapper navbarOptions={{ overrideBackBehavior: () => goBack() }}>
      <View style={{ paddingTop: 28 }}>
        <Title
          style={{
            paddingLeft: 28,
            fontWeight: "300",
            fontFamily: "Roboto_300Light",
          }}
        >
          {buildingName[0].replace("Ed.", "Edificio")}
          <Title>{" " + buildingName[1]}</Title>
        </Title>
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      <View style={{ flex: 1, marginTop: 26, marginBottom: 93 }}>
        <FreeClassList data={building.freeRoomList} />
      </View>
    </PageWrapper>
  )
}
