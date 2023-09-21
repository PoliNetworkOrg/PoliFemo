import { Pressable } from "react-native"
import { SearchTag, getSearchTagIcon } from "utils/search"

import { BodyText } from "components/Text"
import { Icon } from "components/Icon"
import { usePalette } from "utils/colors"

interface SearchTagFilterProps {
  tag: SearchTag
  title: string
  onClick: () => void
  isSelected: boolean
}

export const SearchTagFilter = ({
  tag,
  title,
  onClick,
  isSelected,
}: SearchTagFilterProps) => {
  const { isLight, buttonFill } = usePalette()
  const icon = getSearchTagIcon(tag)

  return (
    <Pressable
      onPress={onClick}
      style={{
        flexDirection: "row",
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        gap: 6,
        borderWidth: 2,
        borderColor: isLight ? "#424967" : "#8791BD",
        backgroundColor: isSelected
          ? isLight
            ? "#424967"
            : "#FFB544"
          : "transparent",
      }}
    >
      <Icon
        source={icon}
        color={isSelected ? "#fff" : buttonFill}
        scale={0.7}
      />
      <BodyText
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: isSelected ? "#fff" : isLight ? "#454773" : "#fff",
        }}
      >
        {title}
      </BodyText>
    </Pressable>
  )
}
