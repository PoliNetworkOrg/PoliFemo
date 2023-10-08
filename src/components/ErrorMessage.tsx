import { BodyText } from "components/Text"
import { FC } from "react"
import { StyleProp, View, TextStyle, Dimensions } from "react-native"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import polifemoIcon from "assets/polifemo/error.svg" // <-- NON è quella giusta!!
import { usePalette } from "utils/colors"
import { useTranslation } from "react-i18next"

interface ErrorMessageProps {
  message: string
  styleMessage?: StyleProp<TextStyle>
}

/**
 * This component displays a message if an error occurs.
 */
export const ErrorMessage: FC<ErrorMessageProps> = props => {
  const polifemoSVG = useSVG(polifemoIcon)

  const { primary } = usePalette()

  const { t } = useTranslation("common")

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
          marginBottom: 24,
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
      <BodyText
        style={[
          {
            textAlign: "center",
          },
          props.styleMessage,
        ]}
      >
        <BodyText style={{ fontSize: 24, color: primary }}>Ops! </BodyText>
        <BodyText style={{ fontWeight: "900", fontSize: 24, color: primary }}>
          {t("error") + "\n"}
        </BodyText>
        <BodyText style={{ color: primary }}>{props.message}</BodyText>
      </BodyText>
    </View>
  )
}
