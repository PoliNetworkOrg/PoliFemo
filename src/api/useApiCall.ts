import React from "react"
import { CancellableApiRequest, RequestOptions } from "./HttpClient"

const controller = new AbortController()
controller.signal

export type ApiCall<T = never, D = unknown> = (
  callParams: T,
  options?: RequestOptions
) => CancellableApiRequest<D, D>

export type ApiCollection = Record<string, ApiCall>

/**
 * This hook makes an API call stateful, it will return the data, loading state
 * and error state. It will also re-run the call when the dependencies change.
 *
 * The call will be cancelled when the component unmounts.
 *
 * @example
 * ### Usage:
 * ```tsx
 * const [rooms, loading, error] = useApiCall(
 *   api.rooms.getFreeRoomsDay,
 *   { date },
 *   [date]
 * )
 *
 * if (rooms) return <RoomsList rooms={rooms} />
 * if (loading) return <Loading />
 * if (error) return <Error />
 * ```
 * Rooms will be present if the response has been cached, otherwise it will be
 * null until the request is completed.
 * When the request completes it will update again with the new data.
 *
 * If the request fails, the error will be present.
 *
 * @param apiCall the api endpoint that will be called statefully
 * @param params Parameters object for the api call
 * @param deps Dependencies array, the call will be called again when any of
 * these change
 * @param options Override the default options for the request
 * @param preventActualCall If true, the call will not be made, only the
 * stateful data will be returned
 * @returns [data, loading, error, update]
 */
export function useApiCall<T extends Record<string, unknown>, D>(
  apiCall: ApiCall<T, D>,
  params: T,
  deps: React.DependencyList,
  options?: RequestOptions,
  preventActualCall = false
): [D | null, boolean, Error | null, () => void] {
  // This is a hack to force the useEffect to re-run when the update function is called
  const [updater, setUpdater] = React.useState(0)
  const update = React.useCallback(() => {
    setUpdater(prev => prev + 1)
  }, [setUpdater])

  const [data, setData] = React.useState<D | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  React.useEffect(() => {
    if (preventActualCall) {
      setLoading(false)
      setData(null)
      return
    }

    setLoading(true)
    const request = apiCall(params, options)
    setData(request.cachedResponse)

    request
      .then(response => {
        setData(response)
        setLoading(false)
        setError(null)
      })
      .catch((err: Error) => {
        if (err.name !== "AbortError") {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      request.cancel()
    }
  }, [...deps, updater])

  return [data, loading, error, update]
}
