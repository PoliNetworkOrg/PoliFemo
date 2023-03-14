import { FC, useEffect, useState, useRef } from "react"
import {
  TextInput,
  Animated,
  Pressable,
  StyleProp,
  ViewStyle,
  Keyboard,
} from "react-native"
import { usePalette } from "utils/colors"
import searchDark from "assets/menu/searchDark.svg"
import { Icon } from "components/Icon"
import { useTranslation } from "react-i18next"

/**
 * the search bar, which requests a search everytime the input text changes
 */
export const PoliSearchBar: FC<{
  onChange: (searchKey: string) => void
  style?: StyleProp<ViewStyle>
}> = ({ onChange, style }) => {
  const { fieldBackground, fieldText, bodyText, isLight, palette } =
    usePalette()

  const [isFocused, setIsFocused] = useState(false)
  const shadowAnim = useRef(new Animated.Value(0)).current
  const inputText = useRef<TextInput>(null)

  const { t } = useTranslation() //i18n hook

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        inputText.current?.blur()
      }
    )

    return () => {
      keyboardDidHideListener.remove()
    }
  }, [])

  useEffect(() => {
    const duration = 100
    if (isFocused)
      Animated.timing(shadowAnim, {
        duration,
        toValue: 1,
        useNativeDriver: true,
      }).start()
    else
      Animated.timing(shadowAnim, {
        duration,
        toValue: 0,
        useNativeDriver: true,
      }).start()
  }, [isFocused, shadowAnim])

  return (
    <Animated.View
      style={[
        {
          alignSelf: "center",
          marginTop: 46,
          marginBottom: 12,
          width: 285,
          borderRadius: 28,
          backgroundColor: fieldBackground,
          flexDirection: "row",
          // cross-platform
          shadowColor: "#000",
          // iOS only
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: Animated.multiply(shadowAnim, 0.3),
          shadowRadius: 4.65,
          // android only
          elevation: Animated.multiply(shadowAnim, 6),
        },
        style,
      ]}
    >
      <TextInput
        style={{
          paddingLeft: 18,
          color: bodyText,
          flex: 1,
          fontFamily: "Roboto_400Regular",
        }}
        ref={inputText}
        autoCorrect={true}
        placeholder={"" + t("search", { ns: "common" })}
        placeholderTextColor={fieldText}
        selectionColor={bodyText}
        onChangeText={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <Pressable
        style={{
          paddingVertical: 8,
          paddingRight: 18,
          paddingLeft: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={() => {
          inputText.current?.focus()
        }}
      >
        <Icon
          source={searchDark}
          color={isLight ? palette.primary : undefined}
        />
      </Pressable>
    </Animated.View>
  )
}
