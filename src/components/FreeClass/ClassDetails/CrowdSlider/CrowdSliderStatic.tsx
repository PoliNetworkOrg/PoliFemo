import { FC } from "react"
import { Dimensions, View } from "react-native"
import { usePalette } from "utils/colors"

interface CrowdSliderStaticProps {
  position: number
}

export const CrowdSliderStatic: FC<CrowdSliderStaticProps> = props => {
  const { sliderBorderColor } = usePalette()

  //56 is padding, 28 is circle diameter
  const usableWidth = Dimensions.get("screen").width - 56 - 28

  const startingPos = ((props.position - 1) / 4) * usableWidth

  return (
    <View>
      <View
        style={{
          borderBottomWidth: 0.5,
          width: "100%",
          borderColor: sliderBorderColor,
          marginTop: 15,
          marginBottom: 18,
        }}
      >
        <View
          style={{
            position: "absolute",
            width: 28,
            height: 28,
            backgroundColor: "#D9D9D9",
            borderRadius: 14,
            top: -14,
            transform: [{ translateX: startingPos }],
          }}
        />
      </View>
    </View>
  )
}
