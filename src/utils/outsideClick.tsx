/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React, {
  FC,
  useCallback,
  useContext,
  useRef,
  useEffect,
  useState,
  createContext,
} from "react"
import { GestureResponderEvent, View, ViewProps } from "react-native"

export const outsideClickContext = createContext<{
  addListener: (listener: (event: GestureResponderEvent) => boolean) => void
  removeListener: (listener: (event: GestureResponderEvent) => boolean) => void
}>({
  addListener: () => {
    // noop
  },
  removeListener: () => {
    // noop
  },
})

/**
 * checks if a gesture responder event target is the passed ref or one of its nested children
 * @param target the target of the gesture responder event
 * @param component the ref to check against
 * @returns false if the click is not within the component, true otherwise
 */
function isTapInsideComponent(
  target: GestureResponderEvent["target"],
  component: React.Component
) {
  // everything below here is fucked beyond repair
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (target === component) return true

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const curr = component as any

  if (curr._children && curr._children.length) {
    // check all of the children until one is the target
    for (const child of curr._children) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (child && isTapInsideComponent(target, child)) return true
    }
  }
  return false
}

/**
 * custom hook to listen for clicks outside of a specific component
 * the callback will be fired once a gloabl click event occurs and this event has the target set
 * outside of the component pointed by the returned ref
 *
 * @example
 * ```tsx
 * const [isListening, setIsListening] = useState(true)
 * const ref = useOutsideClick(() => {
 *     console.log("click outside of the view!")
 *     setIsListening(false)
 * }, isListening)
 *
 * return <View ref={ref}>
 *     ...
 * </View>
 * ```
 *
 * @param callback the function to be called once the outside event gets fired
 * @param listening whether the hook should actively be listening or not, used for performance reasong.
 * use a state to set this to true only when the callback needs to be actually executed
 * @returns a ref that must be used to link the component the click should be outside of
 */
export function useOutsideClick<T extends React.Component>(
  callback: () => void,
  listening: boolean
) {
  const ref = useRef<T>(null)

  const listener = useCallback(
    (event: GestureResponderEvent) => {
      if (
        listening &&
        ref.current &&
        !isTapInsideComponent(event.target, ref.current)
      ) {
        // outside click!
        callback()
        return true // the outside click handler should set responder
      }
      return false
    },
    [listening]
  )

  const { addListener, removeListener } = useContext(outsideClickContext)

  useEffect(() => {
    if (!listening) return // only add the listener while, well, listening

    addListener(listener)
    return () => removeListener(listener) // remove on cleanup
  }, [addListener, removeListener, listener, listening])
  return ref
}

const { Provider } = outsideClickContext

/**
 * OutsideClick context provider, also wraps children in a view used to listen to global click events
 */
export const OutsideClickProvider: FC<
  { children: React.ReactNode } & ViewProps
> = ({ children, ...viewProps }) => {
  // a set of listeners actively listening for a gloabl click event
  const [listeners, setListeners] = useState<
    Set<(evt: GestureResponderEvent) => boolean>
  >(new Set())

  const addListener = useCallback(
    (listener: (evt: GestureResponderEvent) => boolean) => {
      setListeners(listeners => {
        const newListeners = new Set(listeners)
        newListeners.add(listener)
        return newListeners
      })
    },
    []
  )

  const removeListener = useCallback(
    (listener: (evt: GestureResponderEvent) => boolean) => {
      setListeners(listeners => {
        const newListeners = new Set(listeners)
        newListeners.delete(listener)
        return newListeners
      })
    },
    []
  )

  const globalClickEvent: (evt: GestureResponderEvent) => boolean = useCallback(
    evt => {
      let result = false
      listeners.forEach(listener => {
        result = listener(evt) || result
      })
      return result
    },
    [listeners]
  )

  return (
    <Provider value={{ addListener, removeListener }}>
      <View
        style={{ flex: 1 }}
        {...viewProps}
        onStartShouldSetResponderCapture={evt => {
          return globalClickEvent(evt)
        }}
      >
        {children}
      </View>
    </Provider>
  )
}
