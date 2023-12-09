import { Pressable, View } from "react-native"
import { SearchTag, getSearchTagIcon } from "utils/search"

import { BodyText } from "components/Text"
import { Icon } from "components/Icon"
import { usePalette } from "utils/colors"
import { Divider } from "components/Divider"

interface SearchTileProps {
  tag: SearchTag
  title: string
  subtitle?: string
  onClick?: () => void
}

export const SearchTile = ({
  tag,
  title,
  subtitle,
  onClick,
}: SearchTileProps) => {
  const { isLight, buttonFill } = usePalette()
  const icon = getSearchTagIcon(tag)

  return (
    <View
      style={{
        paddingHorizontal: 28,
      }}
    >
      <Pressable
        onPress={onClick}
        style={{
          marginVertical: 20,
        }}
      >
        <View style={{ flexDirection: "row", width: "100%" }}>
          <View
            style={{
              height: 48,
              width: 48,
              marginRight: 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon source={icon} color={buttonFill} />
          </View>
          <View
            style={{
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
              {title}
            </BodyText>

            {subtitle && (
              <BodyText
                style={{
                  fontSize: 12,
                  fontWeight: "400",
                  color: isLight ? "#454773" : "#fff",
                }}
              >
                {subtitle}
              </BodyText>
            )}
          </View>
        </View>
      </Pressable>
      <Divider color={"#8791BD"} height={1} />
    </View>
  )
}
