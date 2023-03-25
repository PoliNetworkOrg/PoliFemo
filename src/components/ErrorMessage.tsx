import { BodyText } from "components/Text"
import { FC } from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { Icon } from "./Icon"

interface ErrorMessageProps {
  message: string
  styleView?: StyleProp<ViewStyle>
  styleMessage?: StyleProp<TextStyle>
  image?: number
}

/**
 * This component displays a message if an error occurs.
 */
export const ErrorMessage: FC<ErrorMessageProps> = props => {
  return (
    <View style={[{ flex: 1, marginHorizontal: 20 }, props.styleView]}>
      {props.image ? (
        <Icon style={{ alignSelf: "center" }} source={props.image} />
      ) : undefined}
      <BodyText
        style={[
          {
            flex: 1,
            color: "red", //TBC
            fontWeight: "400", //TBC
            fontSize: 30, //TBC
            alignSelf: "center",
            textAlign: "center",
          },
          props.styleMessage,
        ]}
      >
        {props.message}
      </BodyText>
    </View>
  )
}
