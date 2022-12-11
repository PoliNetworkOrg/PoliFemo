import React, { FC } from "react"
import { View, Animated, StyleSheet } from "react-native"
import { usePalette } from "utils/colors"

export interface RadioButtonCustomProps {
    width?: number
    height?: number
    fillWidth?: number
    fillHeight?: number
    status: boolean
}
/**
 * Custom RadioButton
 *
 * made following this: https://github.com/callstack/react-native-paper/blob/main/src/components/RadioButton/RadioButtonAndroid.tsx
 */
export const RadioButtonCustom: FC<RadioButtonCustomProps> = props => {
    const width = props.width ?? 24
    const height = props.height ?? 24
    const fillHeight = props.fillHeight ?? 12
    const fillWidth = props.fillWidth ?? 12
    const status = props.status

    const { isLight } = usePalette()

    const { current: borderAnim } = React.useRef<Animated.Value>(
        new Animated.Value(2)
    )

    const { current: radioAnim } = React.useRef<Animated.Value>(
        new Animated.Value(1)
    )

    const isFirstRendering = React.useRef<boolean>(true)

    const scale = 1.5

    React.useEffect(() => {
        // Do not run animation on very first rendering
        if (isFirstRendering.current) {
            isFirstRendering.current = false
            return
        }

        if (status === true) {
            radioAnim.setValue(1.2)

            Animated.timing(radioAnim, {
                toValue: 1,
                duration: 150 * scale,
                useNativeDriver: true,
            }).start()
        } else {
            borderAnim.setValue(10)

            Animated.timing(borderAnim, {
                toValue: 2,
                duration: 150 * scale,
                useNativeDriver: false,
            }).start()
        }
    }, [status, borderAnim, radioAnim, scale])

    return (
        <Animated.View
            style={{
                backgroundColor: "#fff",
                borderColor: isLight ? "#232A3E" : "#424968",
                borderWidth: borderAnim,
                height: height,
                width: width,
                borderRadius: width / 2,
            }}
        >
            {status == true ? (
                <View style={[StyleSheet.absoluteFill, styles.radioContainer]}>
                    <Animated.View
                        style={{
                            height: fillHeight,
                            width: fillWidth,
                            borderRadius: fillWidth,
                            backgroundColor: isLight ? "#232A3E" : "#424968",
                            transform: [{ scale: radioAnim }],
                        }}
                    />
                </View>
            ) : null}
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    radioContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
})
