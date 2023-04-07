import { FC } from "react"
import { View, Image } from "react-native"
import { TouchableRipple } from "components/TouchableRipple"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { User } from "api/collections/user"

export interface UserDetailsTileProps {
  user: User
  onPress?: () => void
}

export const UserDetailsTile: FC<UserDetailsTileProps> = ({
  user,
  onPress,
}) => {
  const { isLight } = usePalette()
  return (
    <TouchableRipple isRoundedTopCorners={true} onClick={onPress}>
      <View
        style={{
          paddingHorizontal: 28,
          paddingTop: 30,
          paddingBottom: 12,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <View
            style={{
              width: 80,
              height: 80,
            }}
          >
            <Image
              source={{
                uri: user.profilePic,
              }}
              style={{
                width: "100%",
                height: "100%",
                resizeMode: "cover",

                borderRadius: 40,
              }}
            />
          </View>
          <View style={{ marginLeft: 14, paddingTop: 8 }}>
            <Text
              style={{
                color: isLight ? "#000" : "#fff",
                fontSize: 22,
                fontWeight: "900",
              }}
            >
              {user.firstname} {user.lastname}
            </Text>
            <Text
              style={{
                color: isLight ? "#000" : "#fff",
                fontSize: 16,
                fontWeight: "400",
              }}
            >
              Codice persona {user.codPersona}
            </Text>
          </View>
        </View>
      </View>
    </TouchableRipple>
  )
}
