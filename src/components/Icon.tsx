import {
  BlendMode,
  Canvas,
  Group,
  ImageSVG,
  Skia,
  useSVG,
} from "@shopify/react-native-skia"
import { useAssets } from "expo-asset"
import { FC, useMemo } from "react"
import { StyleProp, ViewStyle } from "react-native"

export interface IconProps {
  /**
   * the source of the icon, usually a number resulting from an import
   */
  source: number

  /**
   * the color of the icon
   * */
  color?: string

  /**
   * the scale of the icon
   */
  scale?: number

  /**
   * the style of the icon
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Renders an icon with correct size directly from imported svg
 *
 * @example import { Icon } from "components/Icon"
 * import svg from "assets/icons/icon.svg"
 *
 * <Icon source={svg} />
 */
export const Icon: FC<IconProps> = props => {
  const [assets, error] = useAssets(props.source)
  if (error) throw error

  const { color } = props
  const paint = useMemo(() => {
    if (!color) return null
    const p = Skia.Paint()
    p.setColorFilter(
      Skia.ColorFilter.MakeBlend(Skia.Color(color), BlendMode.SrcIn),
    )
    return p
  }, [color])

  const icon = assets?.[0]
  const scale = props.scale ?? 1
  const width = (icon?.width ?? 0) * scale
  const height = (icon?.height ?? 0) * scale
  const svg = useSVG(icon?.localUri)

  if (!svg) return null

  return (
    <Canvas style={[{ width, height }, props.style]}>
      <Group layer={paint}>
        <ImageSVG
          x={0}
          y={0}
          width={width}
          height={height}
          svg={svg}
          transform={[{ scale }]}
        />
      </Group>
    </Canvas>
  )
}
