import { MainStackScreen } from "navigation/NavigationTypes"
import { useContext, useEffect, useState } from "react"
import { View } from "react-native"
import { BodyText, Title } from "components/Text"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"
import { getBuildingCoords, isRoomFree } from "utils/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"
import { RoomSimplified } from "api/rooms"
import { useMounted } from "utils/useMounted"

/**
 * In this page the user can select finally the free class he wants.
 */
export const ClassChoice: MainStackScreen<"ClassChoice"> = props => {
  const { building } = props.route.params

  const { date, setDate } = useContext(RoomsSearchDataContext)

  const coords = getBuildingCoords(building.campus, building.name)

  const isMounted = useMounted()

  const [filteredRooms, setFilteredRooms] = useState<
    RoomSimplified[] | undefined
  >(building.freeRoomList)

  const allRooms = building.allRoomList

  useEffect(() => {
    if (isMounted) {
      const newFilteredRooms = allRooms?.filter(room => {
        return isRoomFree(room, date)
      })
      setFilteredRooms(newFilteredRooms)
    }
  }, [date])

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
          {building.name[0]
            .replace("Ed.", "Edificio")
            .replace("Pad.", "Padiglione")
            .replace("Pal.", "Palazzina")}
          <Title>{" " + building.name[1]}</Title>
        </Title>
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      <View style={{ flex: 1, marginTop: 26, marginBottom: 93 }}>
        {filteredRooms?.length === 0 ? (
          <BodyText
            style={{
              alignSelf: "center",
              marginTop: 100,
              color: "red",
              fontWeight: "700",
              fontSize: 30,
              textAlign: "center",
            }}
          >
            Non ci sono aule disponibili
          </BodyText>
        ) : (
          <FreeClassList
            data={filteredRooms}
            date={date}
            latitude={coords?.latitude}
            longitude={coords?.longitude}
          />
        )}
      </View>
    </PageWrapper>
  )
}
