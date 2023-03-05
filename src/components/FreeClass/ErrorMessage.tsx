import { BodyText } from "components/Text"
import { FC } from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"

interface ErrorMessageProps {
    styleView: StyleProp<ViewStyle>
    styleMessage: StyleProp<TextStyle>
    message: string
}

/**
 * This component displays a message if an error occurs.
 */
export const ErrorMessage: FC<ErrorMessageProps> = props => {
    return(
        <View style={props.styleView}>
            <BodyText
            style={props.styleMessage}
          >
            {props.message}
          </BodyText>
        </View>
    )
}
