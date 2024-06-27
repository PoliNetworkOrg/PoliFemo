import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import { BodyText } from "components/Text"
import { FC } from "react"
import { Dimensions, StyleProp, TextStyle, View } from "react-native"
import { usePalette } from "utils/colors"

interface PolifemoMessageProps {
  title: string
  subTitle?: string
  icon: number
  styleTitle?: StyleProp<TextStyle>
  styleSubTitle?: StyleProp<TextStyle>
}

export const PolifemoMessage: FC<PolifemoMessageProps> = props => {
  const polifemoSVG = useSVG(props.icon)

  const { primary } = usePalette()

  return (
    <View
      style={{
        justifyContent: "center",
        marginVertical: 40,
      }}
    >
      <Canvas
        style={{
          height: 200,
          width: Dimensions.get("window").width,
          alignSelf: "center",
          marginBottom: 5,
        }}
      >
        {polifemoSVG && (
          <ImageSVG
            svg={polifemoSVG}
            x={0}
            y={0}
            width={Dimensions.get("window").width}
            height={200}
          />
        )}
      </Canvas>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <BodyText style={[{ fontSize: 20, color: primary }, props.styleTitle]}>
          {props.title}
        </BodyText>
        {props.subTitle ? (
          <BodyText style={[{ color: primary }, props.styleSubTitle]}>
            {props.subTitle}
          </BodyText>
        ) : undefined}
      </View>
    </View>
  )
}
