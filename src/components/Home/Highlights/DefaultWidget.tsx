import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
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
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BodyText
            style={{
              fontWeight: "500",
              color: "#8791BD", //palette?
              fontSize: 20,
              textAlign: "right",
            }}
          >
            Goditi la tua tranquillità, puoi rilassarti
          </BodyText>
        </View>
        <Canvas
          style={{
            height: 128,
            width: 63,
            backgroundColor: "red",
            position: "relative",
            marginTop: -27,
          }}
        >
          {polifemoSVG && (
            <ImageSVG svg={polifemoSVG} x={0} y={0} width={63} height={128} />
          )}
        </Canvas>
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
