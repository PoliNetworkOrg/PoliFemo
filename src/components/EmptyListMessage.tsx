import { BodyText } from "components/Text"
import { FC } from "react"
import { StyleProp, View, TextStyle } from "react-native"
import { Canvas, Group, ImageSVG, useSVG } from "@shopify/react-native-skia"
import polifemoIcon from "assets/highlights/polifemo.svg" // <-- NON è quella giusta!!
import { usePalette } from "utils/colors"
import { useTranslation } from "react-i18next"

interface EmptyMessageProps {
  message: string
  styleMessage?: StyleProp<TextStyle>
}

/**
 * This component displays a message if an error occurs.
 */
export const EmptyListMessage: FC<EmptyMessageProps> = props => {
  const polifemoSVG = useSVG(polifemoIcon)

  const { primary } = usePalette()

  const { t } = useTranslation("freeClass")

  return (
    <View
      style={{
        justifyContent: "center",
        flex: 0.8,
      }}
    >
      <View style={{ justifyContent: "space-evenly", flex: 0.9 }}>
        <Canvas
          style={{
            height: 192,
            width: 97.5,
            alignSelf: "center",
          }}
        >
          {polifemoSVG && (
            <Group transform={[{ scale: 2.73 }]}>
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
          {props.message + t("freeClass_emptyList")}
        </BodyText>
      </View>
    </View>
  )
}
