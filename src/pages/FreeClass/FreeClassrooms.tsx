import React, { useState } from "react"
import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"
import { View, Dimensions, Pressable, Alert } from "react-native"
import { PoliSearchBar } from "components/Home"
import { usePalette } from "utils/colors"
import { Title, BodyText } from "components/Text"
import { Canvas, useSVG, ImageSVG } from "@shopify/react-native-skia"
import campusIcon from "assets/freeClassrooms/campus.svg"
import position1Icon from "assets/freeClassrooms/position1.svg"
import position2Icon from "assets/freeClassrooms/position2.svg"
import * as Location from "expo-location"
import { ContentWrapperScroll } from "components/ContentWrapperScroll"

const { width } = Dimensions.get("window")

enum SearchClassType {
  GPS_POSITION,
  HEADQUARTER,
}
interface FreeClassInterface {
  id: number
  type: SearchClassType
  text: string[]
}

const freeClassButtons: FreeClassInterface[] = [
  {
    id: 0,
    type: SearchClassType.GPS_POSITION,
    text: ["In base alla tua", "posizione"],
  },
  { id: 1, type: SearchClassType.HEADQUARTER, text: ["Scegli la tua", "sede"] },
]

/**
 * This is the first page where the user select the modality to find a free room.
 * There are two options:
 * - Selection by campus
 * - Selection by current user position->this feature is available ONLY IF the GPS is enabled.
 */
export const FreeClassrooms: MainStackScreen<"FreeClassrooms"> = () => {
  const [search, setSearch] = useState("")
  const { navigate } = useNavigation()
  const { palette } = usePalette()

  const campusSVG = useSVG(campusIcon)
  const position1SVG = useSVG(position1Icon)
  const position2SVG = useSVG(position2Icon)

  const [geolocation, setGeoloaction] = useState<boolean>(false)

  const handlePositionPressed = async () => {
    if (geolocation) {
      //if the geolocation is active, the user can proceed
      navigate("PositionChoice")
    } else {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert(
          "Location Service not enabled",
          "Please enable your location services to unlock this feature",
          [{ text: "OK" }],
          { cancelable: false }
        )
      } else {
        setGeoloaction(true)
        navigate("PositionChoice")
      }
    }
  }

  return (
    <ContentWrapperScroll
      scrollViewStyle={{ paddingBottom: 60 }}
      style={{ marginTop: 106 }}
    >
      <View style={{ paddingTop: 28 }}>
        <Title style={{ paddingLeft: 28, marginBottom: 17 }}>Aule Libere</Title>
        <PoliSearchBar onChange={searchKey => setSearch(searchKey)} />
      </View>
      <View style={{ width, alignItems: "center" }}>
        {freeClassButtons.map(item => (
          <Pressable
            key={"freeClass_" + item.id}
            style={{
              marginTop: 18,
              backgroundColor: palette.primary,
              width: width - 54,
              height: 190,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              alignItems: "center",
            }}
            onPress={
              item.type === SearchClassType.HEADQUARTER
                ? () =>
                    navigate("HeadquarterChoice", {
                      currentDate: new Date().toString(),
                    })
                : () => handlePositionPressed()
            }
          >
            <Canvas
              style={{
                flex: 1,
                width: item.type === SearchClassType.HEADQUARTER ? 90 : 80,
                alignSelf: "center",
                marginTop: item.type === SearchClassType.HEADQUARTER ? 33 : 28,
              }}
            >
              {item.type === SearchClassType.GPS_POSITION && position1SVG && (
                <ImageSVG
                  svg={position1SVG}
                  x={11}
                  y={0}
                  width={54}
                  height={76}
                />
              )}
              {item.type === SearchClassType.GPS_POSITION && position2SVG && (
                <ImageSVG
                  svg={position2SVG}
                  x={0}
                  y={65}
                  width={79}
                  height={27}
                />
              )}
              {item.type === SearchClassType.HEADQUARTER && campusSVG && (
                <ImageSVG svg={campusSVG} x={0} y={0} width={90} height={85} />
              )}
            </Canvas>
            <BodyText
              style={{
                fontWeight: "300",
                color: "white",
                marginBottom: 23,
              }}
            >
              {item.text[0]}{" "}
              <BodyText
                style={{
                  fontWeight: "900",
                  color: "white",
                }}
              >
                {item.text[1]}
              </BodyText>
            </BodyText>
          </Pressable>
        ))}
      </View>
    </ContentWrapperScroll>
  )
}
