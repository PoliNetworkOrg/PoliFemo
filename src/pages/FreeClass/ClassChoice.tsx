import { MainStackScreen } from "navigation/NavigationTypes"
import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { Title } from "components/Text"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"
import { getBuildingCoords } from "utils/rooms"

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

  const coords = getBuildingCoords(building.campus, building.name)

  return (
    <PageWrapper style={{ marginTop: 106 }}>
      <View style={{ paddingTop: 28 }}>
        <Title
          style={{
            paddingLeft: 28,
            fontWeight: "300",
            fontFamily: "Roboto_300Light",
          }}
        >
          {building.name[0].replace("Ed.", "Edificio")}
          <Title>{" " + building.name[1]}</Title>
        </Title>
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      <View style={{ flex: 1, marginTop: 26, marginBottom: 93 }}>
        <FreeClassList
          data={building.freeRoomList}
          date={date}
          latitude={coords?.latitude}
          longitude={coords?.longitude}
        />
      </View>
    </PageWrapper>
  )
}
