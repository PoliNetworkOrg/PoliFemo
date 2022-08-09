import React, { FC } from "react"
import {
    Animated,
    LayoutChangeEvent,
    ViewProps,
    StyleSheet,
} from "react-native"

/**
 * a sticky header for react-native's scrollview (see [StickyHeaderComponent](https://reactnative.dev/docs/scrollview#stickyheadercomponent))
 *
 * this thing allows a sticky header to stay still once the next sticky header is reached (the lower
 * one basically scrolls past the upper one)
 */
export const StickyHeader: FC<{
    scrollAnimatedValue: Animated.AnimatedValue
    nextHeaderLayoutY?: number
    onLayout: (e: LayoutChangeEvent) => void
    // eslint-disable-next-line react/display-name
}> = React.forwardRef((props, ref) => {
    const [layoutY, setLayoutY] = React.useState(0)
    const { children, scrollAnimatedValue, onLayout } = props

    // needed to get the top offset, otherwise it wont work properly
    const childStyle = StyleSheet.flatten(
        (children as React.ReactElement<ViewProps>)?.props?.style ?? {}
    )

    return (
        <Animated.View
            ref={ref}
            onLayout={e => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                const top = childStyle.top
                setLayoutY(
                    e.nativeEvent.layout.y + (typeof top === "number" ? top : 0)
                )
                // setLayoutHeight(e.nativeEvent.layout.height)
                onLayout(e)
            }}
            style={{
                zIndex: childStyle.zIndex,
                transform: [
                    {
                        // the trick is translating the component of the amount scrolled only once the
                        // layoutY is reached (the starting y of the header in relation to the scrollview)
                        translateY: scrollAnimatedValue.interpolate({
                            inputRange: [-1, layoutY, layoutY + 1],
                            outputRange: [0, 0, 1],
                        }),
                    },
                ],
            }}
        >
            {children}
        </Animated.View>
    )
})
