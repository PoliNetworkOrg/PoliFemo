import { MainStackScreen } from "navigation/NavigationTypes"
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, View } from "react-native"
import { Title } from "components/Text"
import { FreeClassList } from "components/FreeClass/FreeClassList"
import { DateTimePicker } from "components/FreeClass/DateTimePicker/DateTimePicker"
import { PageWrapper } from "components/Groups/PageWrapper"
import { getBuildingCoords, isRoomFree } from "utils/rooms"
import { RoomsSearchDataContext } from "contexts/rooms"
import { Room } from "api/rooms"
import { Switch } from "react-native-switch"
import { usePalette } from "utils/colors"
import { ErrorMessage } from "components/FreeClass/ErrorMessage"

/**
 * In this page the user can select finally the free class he wants.
 */
export const ClassChoice: MainStackScreen<"ClassChoice"> = props => {
  const { building } = props.route.params

  const {
    date,
    setDate,
    rooms,
    acronym,
    isRoomsSearching,
    toggleSearchNow,
    setToggleSearchNow,
  } = useContext(RoomsSearchDataContext)

  const coords = getBuildingCoords(building.campus, building.name)

  const [buildingRooms, setBuildingRooms] = useState<Room[]>([])

  const [filteredRooms, setFilteredRooms] = useState<Room[]>([])

  const { backgroundSecondary, palette, isLight } = usePalette()

  //update rooms from which to apply date filters
  useEffect(() => {
    const newBuildingRooms = rooms[building.campus.acronym].rooms.filter(
      room => {
        return building.fullName === room.building
      }
    )
    setBuildingRooms(newBuildingRooms)
  }, [rooms[acronym].rooms])

  //apply date and toggle filters
  useEffect(() => {
    const newFilteredRooms = buildingRooms.filter(room => {
      return isRoomFree(room, date, toggleSearchNow)
    })
    setFilteredRooms(newFilteredRooms ?? [])
  }, [buildingRooms, toggleSearchNow, date])

  return (
    <PageWrapper style={{ marginTop: 106 }}>
      <View style={{ paddingTop: 28 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
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
          <Switch
            activeTextStyle={{
              fontSize: 16,
              color: palette.darker,
              textAlign: "auto",
              fontFamily: "Roboto_700Bold",
            }}
            activeText={"FREE NOW"}
            inActiveText={"FREE NOW"}
            inactiveTextStyle={{
              fontSize: 16,
              color: "#D9D9D9",
              textAlign: "auto",
              fontFamily: "Roboto_700Bold",
            }}
            value={toggleSearchNow}
            onValueChange={value => {
              setToggleSearchNow(value)
            }}
            changeValueImmediately={true}
            barHeight={40}
            switchWidthMultiplier={5.2}
            circleSize={24}
            circleActiveColor={backgroundSecondary}
            circleInActiveColor={palette.accent}
            circleBorderWidth={0}
            innerCircleStyle={{
              borderWidth: 1,
              borderColor: toggleSearchNow
                ? palette.accent
                : isLight
                ? "#EBEBEB"
                : "#3A4257",
            }}
            backgroundActive={palette.accent}
            backgroundInactive={"#FFF"}
            containerStyle={{
              borderWidth: 1,
              borderColor: palette.accent,
              marginRight: 36,
            }}
            switchLeftPx={-20}
            switchRightPx={20}
          />
        </View>
        <DateTimePicker date={date} setDate={(date: Date) => setDate(date)} />
      </View>
      <View style={{ flex: 1, marginTop: 26, marginBottom: 93 }}>
        {filteredRooms?.length === 0 && !isRoomsSearching ? (
          <ErrorMessage
            message="Non ci sono aule disponibili"
            styleView={{ marginTop: 100, marginHorizontal: 20 }}
            styleMessage={{
              alignSelf: "center",
              color: "red",
              fontWeight: "400",
              fontSize: 30,
              textAlign: "center",
            }}
          />
        ) : !isRoomsSearching && filteredRooms.length > 0 ? (
          <FreeClassList
            data={filteredRooms}
            date={date}
            latitude={coords?.latitude}
            longitude={coords?.longitude}
          />
        ) : (
          <ActivityIndicator size={"large"} style={{ marginTop: 100 }} />
        )}
      </View>
    </PageWrapper>
  )
}
