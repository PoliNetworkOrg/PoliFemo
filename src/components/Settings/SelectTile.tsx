import React, { FC } from "react"
import { Pressable, View } from "react-native"
import { Text } from "components/Text"
import { usePalette } from "utils/colors"
import { RadioButtonCustom } from "./RadioButtonCustom"
import { ThemeSelectorContext } from "utils/radioButton"
import { ValidColorSchemeName } from "utils/settings"

export interface SelectTileProps {
    /**
     * label shown on screen besides radio button
     */
    name: string
    /**
     * value who will update RadioButton context state
     */
    storageValue: ValidColorSchemeName
}

/**
 * A tile designed to use in conjunction with {@link RadioButtonGroup}
 */
export const SelectTile: FC<SelectTileProps> = props => {
    const { isLight, palette } = usePalette()
    return (
        <ThemeSelectorContext.Consumer>
            {context => {
                return (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 12,
                            paddingLeft: 36,
                            paddingRight: 46,
                        }}
                    >
                        <Pressable
                            onPress={() => context.setTheme(props.storageValue)}
                        >
                            <RadioButtonCustom
                                status={props.storageValue === context.theme}
                                darkColor={palette.darker}
                            />
                        </Pressable>
                        <View>
                            <Pressable
                                onPress={() =>
                                    context.setTheme(props.storageValue)
                                }
                            >
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontWeight: "400",
                                        color: isLight ? "#000" : "#fff",
                                        textAlign: "left",
                                        paddingLeft: 16,
                                    }}
                                >
                                    {props.name}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                )
            }}
        </ThemeSelectorContext.Consumer>
    )
}
