import { FC } from "react"
import { StyleProp, View, ViewStyle } from "react-native"
import { Image, ImageProps, ImageStyle } from "expo-image"

type ImageBackgroundProps = ImageProps & {
  style?: StyleProp<ViewStyle>
  imageStyle?: ImageStyle
  children: React.ReactNode
}

export const ImageBackground: FC<ImageBackgroundProps> = props => {
  return (
    <View
      accessibilityIgnoresInvertColors={true}
      importantForAccessibility={props.importantForAccessibility}
      style={props.style}
    >
      <Image
        {...props}
        importantForAccessibility={props.importantForAccessibility}
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
          },
          props.imageStyle ?? {},
        ]}
      />
      {props.children}
    </View>
  )
}
