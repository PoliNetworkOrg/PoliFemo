import { Canvas, Group, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { Divider } from "components/Divider"
import { BodyText } from "components/Text"
import React, { FC } from "react"
import { View, Dimensions } from "react-native"
import { usePalette } from "utils/colors"
import polifemoIcon from "assets/highlights/polifemo.svg"

const { width } = Dimensions.get("window")

export const DefaultWidget: FC = () => {
  const { isLight } = usePalette()

  const polifemoSVG = useSVG(polifemoIcon)

  return (
    <View
      style={{
        width,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: width - 80,
          height: 77,
          backgroundColor: isLight ? "#F6F7FC" : "#343E5A", //forse meglio usare palette
          borderRadius: 10,
          flexDirection: "row",
        }}
      >
        <Canvas
          style={{
            height: 128,
            width: 65,
            position: "relative",
            marginTop: -27,
            marginLeft: 15,
          }}
        >
          {polifemoSVG && (
            <Group transform={[{ scale: 1.82 }]}>
              <ImageSVG
                svg={polifemoSVG}
                x={-9.2}
                y={-29.5}
                width={63}
                height={128}
              />
            </Group>
          )}
        </Canvas>
        <View
          style={{
            marginLeft: 12,
            marginRight: 80,
            alignSelf: "center",
          }}
        >
          <BodyText
            style={{
              fontWeight: "500",
              color: "#8791BD", //palette?
              fontSize: 19,
              textAlign: "center",
            }}
          >
            Goditi la tua tranquillità, puoi rilassarti
          </BodyText>
        </View>
      </View>
      <Divider style={{ marginTop: 38, width: width - 80 }} />
      <BodyText
        style={{
          fontWeight: "400",
          color: "#8791BD", //palette?
          fontSize: 11,
          textAlign: "center",
          marginTop: 14,
        }}
      >
        Nessun avviso in evidenza
      </BodyText>
    </View>
  )
}
