import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"

export const WeekLine: FC = () => {
  const days = ["L", "M", "M", "G", "V", "S"]
  return (
    <View style={{ flexDirection: "row", marginTop: 10 }}>
      <View
        style={{
          flexDirection: "column",
          marginBottom: 8,
          borderRightWidth: 1,
          borderColor: "white",
          paddingRight: 10,
        }}
      >
        {days.map((item, index) => (
          <BodyText
            style={{
              fontWeight: "900",
              fontSize: 12,
              color: "white",
              marginVertical: 40,
            }}
            key={index}
          >
            {item}
          </BodyText>
        ))}
      </View>
    </View>
  )
}
