import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"

export const TimeLine: FC = () => {
  const times: string[] = [
    "08:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
  ]

  return (
    <View style={{ marginLeft: 40 }}>
      <View
        style={{
          flexDirection: "row",
          marginBottom: 8,
          borderBottomWidth: 1,
          borderColor: "white",
          paddingBottom: 8,
        }}
      >
        {times.map((item, index) => (
          <BodyText
            style={{
              fontWeight: "900",
              fontSize: 12,
              color: "white",
              marginHorizontal: 15,
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
