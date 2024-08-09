import { FC } from "react"
import { View } from "react-native"

export const DottedLine: FC = () => {
  return (
    <>
      <View
        style={{
          width: 4,
          height: 4,
          backgroundColor: "#E6E6E6",
          marginTop: 0,
        }}
      />
      <View
        style={{
          width: 4,
          height: 6,
          backgroundColor: "#E6E6E6",
          marginTop: 4,
        }}
      />
      <View
        style={{
          width: 4,
          height: 6,
          backgroundColor: "#E6E6E6",
          marginTop: 4,
        }}
      />
      <View
        style={{
          width: 4,
          height: 4,
          backgroundColor: "#E6E6E6",
          marginTop: 4,
        }}
      />
    </>
  )
}
