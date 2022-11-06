import React, { FC, useEffect, useState, useRef } from "react"
import { TextInput, Animated, Pressable, Easing } from "react-native"
import { usePalette } from "utils/colors"
import { Canvas, ImageSVG, useSVG } from "@shopify/react-native-skia"
import searchLight from "assets/menu/searchLight.svg"
import searchDark from "assets/menu/searchDark.svg"

/**
 * the search bar, which requests a search everytime the input text changes
 */
export const PoliSearchBar: FC<{
    onChange: (searchKey: string) => void
}> = ({ onChange }) => {
    const { fieldBackground, fieldText, bodyText, isLight } = usePalette()

    const svg = useSVG(isLight ? searchLight : searchDark)

    const [isFocused, setIsFocused] = useState(false)
    const shadowAnim = useRef(new Animated.Value(0)).current
    const inputText = useRef<TextInput>(null)
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
            style={{
                marginTop: 46,
                marginBottom: 23,
                marginHorizontal: 52,
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
            }}
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
                placeholder="Cerca"
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
                <Canvas
                    style={{
                        width: 22,
                        height: 22,
                    }}
                >
                    {svg && (
                        <ImageSVG
                            svg={svg} /*color??*/
                            x={0}
                            y={0}
                            width={22}
                            height={22}
                        />
                    )}
                </Canvas>
            </Pressable>
        </Animated.View>
    )
}
