import { CancellableApiRequest } from "./HttpClient"

/**
 * Maps the response data of an axios request to a new type.
 * @param request the request to be mapped
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
