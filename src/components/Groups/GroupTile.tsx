import { Divider } from "components/Divider"
import { Icon } from "components/Icon"
import { BodyText } from "components/Text"
import { FC } from "react"
import { Pressable, View } from "react-native"
import { usePalette } from "utils/colors"

export interface GroupTileProps {
  text?: string
  icon: number | null
  members?: string
  onClick?: () => void
}

export const GroupTile: FC<GroupTileProps> = props => {
  const { isLight } = usePalette()

  return (
    <View style={{ flex: 1, paddingHorizontal: 28 }}>
      <Pressable
        onPress={props.onClick}
        style={{
          marginVertical: 20,
          flex: 1,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
          <View
            style={{
              borderRadius: 24,
              backgroundColor: "transparent",
              height: 48,
              width: 48,
              marginRight: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon source={props.icon} />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "space-evenly",
            }}
          >
            <BodyText
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: isLight ? "#454773" : "#fff",
              }}
            >
              {props.text}
            </BodyText>

            {props.members && (
              <BodyText
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: isLight ? "#454773" : "#fff",
                }}
              >
                {props.members} members
              </BodyText>
            )}
          </View>
        </View>
      </Pressable>
      <Divider color={"#8791BD"} height={1} />
    </View>
  )
}
