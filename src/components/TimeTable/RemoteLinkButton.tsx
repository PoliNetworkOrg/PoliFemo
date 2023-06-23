import { RemoteLink } from "api/collections/event"
import { Icon } from "components/Icon"
import { FC } from "react"
import { Linking, Pressable } from "react-native"
import remoteIcon from "assets/timetable/remote.svg"
import { usePalette } from "utils/colors"
import { BodyText } from "components/Text"

interface RemoteLinkButtonProps {
  remoteLink: RemoteLink
}

/**
 * Component that represents the button that opens the remote link.
 */
export const RemoteLinkButton: FC<RemoteLinkButtonProps> = ({ remoteLink }) => {
  const { iconHighContrast } = usePalette()
  return (
    <Pressable
      onPress={() => {
        // open url
        void Linking.openURL(remoteLink.url)
      }}
      onLongPress={() => {
        // TODO: copy url in clipboard
      }}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        padding: 4,
      }}
    >
      <Icon source={remoteIcon} />
      <BodyText
        style={{
          fontWeight: "700",
          marginLeft: 10,
          color: iconHighContrast,
        }}
      >
        {remoteLink.link_description.it.split(" - ").join("\n")}
      </BodyText>
    </Pressable>
  )
}
