import { BodyText } from "components/Text"
import { FC } from "react"
import { Dimensions, Linking, Pressable, View } from "react-native"
import { palette } from "utils/colors"

export interface Contributor {
  login: string
  name: string
  // eslint-disable-next-line @typescript-eslint/naming-convention
  avatar_url: string
  profile?: string
  contributions: string[]
}

const { width } = Dimensions.get("window")

export const ContributorTile: FC<Contributor> = props => {
  return (
    <Pressable
      style={{
        width: width - 65,
        height: 93,
        backgroundColor: palette.lighter,
        marginBottom: 34,
        borderRadius: 16,
        justifyContent: "center",
      }}
      onPress={() =>
        props.profile ? Linking.openURL(props.profile) : undefined
      }
    >
      <View
        style={{
          flexDirection: "row",
          width: width - 65,
          justifyContent: "center",
        }}
      >
        <BodyText
          style={{
            fontWeight: "500",
            fontSize: 20,
            color: "white",
          }}
        >
          {props.name}
        </BodyText>
      </View>
    </Pressable>
  )
}
