import { client } from "api"
import React from "react"

/**
 * Custom Hook used to wait for the tokens to be loaded before booting the app
 * This will return true once the token are read from storage, wether they are
 * present or not
 * @returns true if the promise has returned, false otherwise
 */
export const useLoadTokens = () => {
    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
        void client.loadTokens().then(() => setLoaded(true))
    }, [client]) // this has to be here for hot reload to work
    return loaded
}
