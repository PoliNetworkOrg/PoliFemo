import { BodyText } from "components/Text"
import { FC } from "react"
import { StyleProp, View, TextStyle, Dimensions } from "react-native"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import polifemoIcon from "assets/polifemo/empty.svg" // <-- NON è quella giusta!!
import { usePalette } from "utils/colors"
import { useTranslation } from "react-i18next"

interface EmptyMessageProps {
  message?: string | null
  styleMessage?: StyleProp<TextStyle>
}

/**
 * This component displays a message if an error occurs.
 */
export const EmptyListMessage: FC<EmptyMessageProps> = props => {
  const polifemoSVG = useSVG(polifemoIcon)

  const { primary } = usePalette()

  const { t } = useTranslation()

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
            color: primary,
            fontWeight: "400",
            fontSize: 16,
            textAlign: "center",
          },
          props.styleMessage,
        ]}
      >
        {(props.message ?? t("emptyDefault")) + t("emptyList")}
      </BodyText>
    </View>
  )
}
