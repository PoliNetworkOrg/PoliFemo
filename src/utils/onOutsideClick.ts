import React from "react"
import { View } from "react-native"

export const outsideClickContext = React.createContext({
    onGlobalTouchStart: () => {
        // noop
    },
})

export function onClickOutside(callback: () => void) {
    const { onGlobalTouchStart } = React.useContext(outsideClickContext)
    const ref = React.useRef<View>(null)
    React.useEffect(() => {
        onGlobalTouchStart(event => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback()
            }
        })
    }, [ref, callback])
    return { ref, onStartShouldSetResponderCapture }
}
