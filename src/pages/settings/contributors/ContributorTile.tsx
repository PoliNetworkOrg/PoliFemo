import { BodyText } from "components/Text"
import { FC } from "react"
import { Linking, Pressable } from "react-native"
import { palette } from "utils/colors"

/* eslint-disable @typescript-eslint/naming-convention */
export interface Contributor {
  login: string
  name: string
  avatar_url: string
  profile?: string
  contributions: string[]
}
/* eslint-enable @typescript-eslint/naming-convention */

export const ContributorTile: FC<Contributor> = props => {
  return (
    <Pressable
      style={{
        padding: 12,
        backgroundColor: palette.lighter,
        marginBottom: 12,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={() =>
        props.profile ? Linking.openURL(props.profile) : undefined
      }
    >
      <BodyText
        style={{
          fontWeight: "500",
          fontSize: 20,
          color: "white",
          textAlign: "center",
        }}
      >
        {props.name}
      </BodyText>
    </Pressable>
  )
}
