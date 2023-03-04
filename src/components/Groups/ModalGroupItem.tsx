import { BodyText } from "components/Text"
import { FC } from "react"
import { View } from "react-native"
import { usePalette } from "utils/colors"
import { Group } from "api/groups"
import { choosePlatformIcon } from "utils/groups"
import { Icon } from "components/Icon"

export interface ModalGroupItemProps {
  /**
   * ResetButton
   */
  group?: Group
}

export const ModalGroupItem: FC<ModalGroupItemProps> = props => {
  const { isLight } = usePalette()
  const icon = choosePlatformIcon(props.group?.platform)

  const scaleFactor = 2.5

  return (
    <View
      style={{
        alignItems: "center",
        marginHorizontal: 8,
      }}
    >
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          marginTop: 16,
          marginBottom: 8,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Icon scale={scaleFactor} source={icon} />
      </View>
      <BodyText
        style={{
          fontSize: 32,
          fontWeight: "900",
          color: isLight ? "#414867" : "#fff",
          textAlign: "center",
        }}
      >
        {props.group?.class}
      </BodyText>
      <View>
        {props.group?.members && (
          <BodyText
            style={{
              fontSize: 13,
              fontWeight: "400",
              color: isLight ? "#8791BD" : "#fff",
              textAlign: "center",
            }}
          >
            {props.group.members} members
          </BodyText>
        )}
        <BodyText
          style={{
            fontSize: 13,
            fontWeight: "400",
            color: isLight ? "#414867" : "#fff",
            textAlign: "center",
            marginTop: 16,
          }}
        >
          {props.group?.year}
        </BodyText>
      </View>
    </View>
  )
}
