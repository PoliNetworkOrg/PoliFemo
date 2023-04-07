import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"
import { Canvas, Group, ImageSVG, useSVG } from "@shopify/react-native-skia"
import polifemoIcon from "assets/highlights/polifemo.svg" // <-- NON è quella giusta!!
import { usePalette } from "utils/colors"

interface ErrorMessageProps {
  message: string
}

/**
 * This component displays a message if an error occurs.
 */
export const ErrorMessage: FC<ErrorMessageProps> = props => {
  const { palette, isLight } = usePalette()

  const polifemoSVG = useSVG(polifemoIcon)

  return (
    <View
      style={{
        justifyContent: "center",
        flex: 1,
      }}
    >
      <View style={{ justifyContent: "space-evenly", flex: 0.4 }}>
        <Canvas
          style={{
            height: 128,
            width: 65,
            alignSelf: "center",
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
        <BodyText
          style={{
            color: isLight ? palette.primary : undefined,
            fontWeight: "400",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          Ops! Errore
          {"\n" + props.message}
        </BodyText>
      </View>
    </View>
  )
}
