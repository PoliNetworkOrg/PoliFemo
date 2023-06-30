import { CancellableApiRequest } from "./HttpClient"

/**
 * Maps the response data of an axios request to a new type.
 * The map function is used to modify both the data form the AxiosResponse and
 * the cached response.
 *
 * @param request the request to be mapped as returned by one of the calls in the
 * HttpClient
 * @param mapFunction the function that will be used to map the response data
 * @returns a new request with the mapped data
 */
export function mapAxiosRequest<T, D>(
  request: CancellableApiRequest<T>,
  mapFunction: (res: T) => D
): CancellableApiRequest<D, D> {
  const newRequest = new Promise<D>((resolve, reject) => {
    request
      .then(response => {
        resolve(mapFunction(response.data))
      })
      .catch((error: Error) => {
        reject(error)
      })
  }) as CancellableApiRequest<D, D>
  newRequest.cancel = request.cancel
  newRequest.cachedResponse = request.cachedResponse
    ? mapFunction(request.cachedResponse)
    : null
  return newRequest
}
