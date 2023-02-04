import { useEffect, useState } from "react"

/**
 * useful hook to keep track of first render in multiple useEffects
 *
 * from https://stackoverflow.com/questions/57240169/skip-first-useeffect-when-there-are-multiple-useeffects
 *
 * @example
 * ```ts
 * const [valueFirst, setValueFirst] = useState(0)
 * const [valueSecond, setValueSecond] = useState(0)
 *
 * const isMounted = useMounted()
 *
 * //1st effect which should run whenever valueFirst change except
 * //first time
 * React.useEffect(() => {
 *   if (isMounted) {
 *     console.log("valueFirst ran")
 *   }
 *
 * }, [valueFirst])
 *
 *
 * //2nd effect which should run whenever valueFirst change except
 *  //first time
 *  React.useEffect(() => {
 *    if (isMounted) {
 *      console.log("valueSecond ran")
 *    }
 *
 *  }, [valueSecond])
 *
 * ```
 */
export function useMounted() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])
    return isMounted
}
