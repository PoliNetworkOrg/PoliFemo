import { Pressable } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "navigation/NavigationTypes"

import searchDark from "assets/menu/searchDark.svg"
import { Icon } from "components/Icon"
import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"

export const SearchButton = () => {
  const navigation = useNavigation()
  const { fieldBackground, buttonFill } = usePalette()

  const { t } = useTranslation() //i18n hook

  return (
    <Pressable
      style={{
        flexDirection: "row",
        width: 110,
        marginTop: 46,
        marginBottom: 12,
        paddingVertical: 8,
        backgroundColor: fieldBackground,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        gap: 6,
        borderRadius: 50,
      }}
      onPress={() => navigation.navigate("GlobalSearch")}
    >
      <Icon source={searchDark} color={buttonFill} scale={0.7} />
      <BodyText style={{ color: buttonFill, fontSize: 15 }}>
        {"" + t("search")}
      </BodyText>
    </Pressable>
  )
}
