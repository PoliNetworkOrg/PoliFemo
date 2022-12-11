/**
 *
 * @param routes
 * @returns current route name
 */
export function getCurrentRouteName(routes: { name: string }[]): string {
    const lenght = routes.length
    return routes[lenght - 1].name
}
