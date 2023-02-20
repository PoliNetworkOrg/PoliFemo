import { useSVG, Canvas, ImageSVG } from "@shopify/react-native-skia"
import { BodyText } from "components/Text"
import React, { FC } from "react"
import { View, Pressable, Dimensions } from "react-native"
import { usePalette } from "utils/colors"
import timerIcon from "assets/freeClassrooms/timer.svg"
import overcrowdingIcon from "assets/freeClassrooms/overcrowding.svg"
import fireIcon from "assets/freeClassrooms/fire.svg"
import { useNavigation } from "navigation/NavigationTypes"
import { api } from "api"
import { FlatList } from "react-native-gesture-handler"
import { RoomSimplified } from "api/rooms"

const { width } = Dimensions.get("window")

interface FreeClassListProps {
  data: RoomSimplified[] | undefined
  date: Date
}

/**
 * It handles a list of freeclassrooms available.
 */
export const FreeClassList: FC<FreeClassListProps> = props => {
  const { palette } = usePalette()
  const timerSVG = useSVG(timerIcon)
  const overcrowdingSVG = useSVG(overcrowdingIcon)
  const fireSVG = useSVG(fireIcon)
  const { navigate } = useNavigation()

  return (
    <FlatList
      showsVerticalScrollIndicator={true}
      style={{
        flex: 1,
        marginTop: 27,
      }}
      contentContainerStyle={{
        alignItems: "center",
        justifyContent: "center",
      }}
      data={props.data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }) => (
        <Pressable
          style={{
            width: width - 65,
            height: 93,
            backgroundColor: "#8791BD",
            marginBottom: 34,
            borderRadius: 12,
          }}
          onPress={async () => {
            try {
              const selectedRoom = await api.rooms.getRoomInfo(item.roomId)
              navigate("RoomDetails", {
                room: selectedRoom,
                startDate: props.date.toISOString(),
                roomId: item.roomId,
              })
            } catch (err) {
              console.log(err)
            }
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: width - 65,
              height: 30,
              alignSelf: "center",
              marginTop: 12,
              justifyContent: "center",
            }}
          >
            <Canvas
              style={{
                position: "absolute",
                width: 28,
                height: 33,
                alignSelf: "center",
              }}
            >
              {timerSVG && (
                <ImageSVG svg={timerSVG} x={0} y={0} width={28} height={33} />
              )}
            </Canvas>
            <BodyText
              style={{
                position: "absolute",
                fontWeight: "300",
                fontSize: 12,
                color: "white",
                textAlign: "left",
                paddingLeft: 100,
                marginTop: 3,
              }}
            >
              Libera per{"\n"}
              <BodyText
                style={{
                  fontWeight: "700",
                  fontSize: 14,
                  color: "#414867",
                }}
              >
                2 h 23{"'"}
              </BodyText>
            </BodyText>
          </View>
          <View
            style={{
              flexDirection: "row",
              width: width - 65,
              height: 51,
              justifyContent: "flex-end",
            }}
          >
            <BodyText
              style={{
                position: "absolute",
                fontWeight: "500",
                fontSize: 12,
                color: "#424967",
                textAlign: "right",
                paddingRight: 45,
                marginTop: 12,
              }}
            >
              Mediamente{"\n"}
              <BodyText
                style={{
                  fontWeight: "300",
                  fontSize: 12,
                  color: "#414867",
                }}
              >
                affollato
              </BodyText>
            </BodyText>
            <View
              style={{
                position: "relative",
                width: 40,
                height: 51,
              }}
            >
              <Canvas
                style={{
                  position: "absolute",
                  zIndex: 1,
                  width: 40,
                  height: 51,
                  marginTop: 10,
                }}
              >
                {overcrowdingSVG && (
                  <ImageSVG
                    svg={overcrowdingSVG}
                    x={3}
                    y={7}
                    width={24}
                    height={19}
                  />
                )}
              </Canvas>
              <Canvas
                style={{
                  zIndex: 0,
                  width: 40,
                  height: 51,
                }}
              >
                {fireSVG && (
                  <ImageSVG svg={fireSVG} x={0} y={4} width={29} height={39} />
                )}
              </Canvas>
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              backgroundColor: palette.primary,
              width: "40%",
              height: 93,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 7,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}
          >
            <BodyText
              style={{
                fontWeight: "700",
                color: "white",
                fontSize: 24,
              }}
            >
              {item.name}
            </BodyText>
          </View>
        </Pressable>
      )}
    />
  )
}
