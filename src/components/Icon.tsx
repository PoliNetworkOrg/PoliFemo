import { Asset } from "expo-asset"
import { Image } from "expo-image"
import { FC } from "react"
import { ImageStyle } from "react-native"

export interface IconProps {
  /**
   * the source of the icon, usually a number resulting from an import
   */
  source: number | null

  /**
   * the color of the icon
   * TODO: implement, currently not in expo-image https://github.com/expo/expo/issues/21321#issuecomment-1439098927
   * */
  color?: string

  /**
   * the scale of the icon
   */
  scale?: number

  /**
   * the style of the icon
   */
  style?: ImageStyle
}

/**
 * Renders an icon with correct size directly from imported svg
 *
 * CURRENT LIMITATIONS:
 * due to the current implementation of the svg rendering within expo-image, the
 * color of the icon cannot be changed on iOS, and SVG effects like drop shadows
 * are not supported.
 * For those cases, keep using Skia `Canvas`.
 *
 * @example import { Icon } from "components/Icon"
 * import svg from "assets/icons/icon.svg"
 *
 * <Icon source={svg} />
 */
export const Icon: FC<IconProps> = ({ source, scale, style }) => {
  if (!source) return null

  const icon = Asset.fromModule(source)

  const s = scale ?? 1
  const width = (icon.width ?? 0) * s
  const height = (icon.height ?? 0) * s

  return <Image style={[{ width, height }, style ?? {}]} source={icon.uri} />
}
