/**
 * This file contains the type definitions for the navigation.
 *
 * ** ADDING A SCREEN: **
 * To add a screen to the navigation, you need to add a new entry to the RootStackNavigatorParams
 * type.
 *
 * The key of the entry must be the same as the screen name in the navigator (i.e. the one used in
 * the navigate function `navigation.navigate("Home")`, and the name in the Screen props)
 * The value of the entry is the type describing the params eventually passed to the screen,
 * `undefined` if no params are passed.
 *
 * After adding the new entry, you need to update the RootStackNavigator adding a new Screen
 * component with the correct name
 */

import { StackScreenProps } from "@react-navigation/stack"
import { FC } from "react"
import {
    NavigationProp,
    useNavigation as nativeUseNav,
} from "@react-navigation/native"
import { Article } from "api"
import { Preference } from "components/Home/News"

/**
 * interface containing the info about the params for each page of the stack navigator
 *
 * each page should be a key in this interface, and the value should be the params for that page,
 * or `undefined` if there are no params to be passed
 *
 * More info: https://reactnavigation.org/docs/typescript/
 */
export type RootStackNavigatorParams = {
    /* eslint-disable @typescript-eslint/naming-convention */
    Home: undefined
    Article: { article: Article }
    ArticlesList: { tagName: string; tagPreference: Preference }
    Error404: undefined
    /* eslint-enable @typescript-eslint/naming-convention */
}

// Here are a couple of magic types, straight from the Underground Realm of Weird Types:

/**
 * Type for the props of a screen component from the root stack navigator.
 * The name of the screen in the navigator must be passed as an argument.
 *
 * @example
 * ```tsx
 * function Home(props: RootStackScreenProps<"Home">) {
 *     let { navigation, route } = props
 *
 *     useEffect(() => {
 *         navigation.setOptions({ headerTitle: "Home", })
 *     }, [])
 *
 *     return <Text>Home</Text>
 * }
 * ```
 */
export type RootStackProps<T extends keyof RootStackNavigatorParams> =
    StackScreenProps<RootStackNavigatorParams, T>

/**
 * Type for a component of the root stack navigator, use in place of `FC`.
 *
 * You must pass the name of the screen as the first argument, and optionally additional props
 * as the second argument.
 *
 * @example
 * ```tsx
 * const Page: RootStackProps<"NewsPage", {title: string}> = props => {
 *    let { navigation, route, title } = props
 *
 *    useEffect(() => {
 *         navigation.setOptions({ headerTitle: "News Page", })
 *     }, [])
 *
 *    return <Text>{title}</Text>
 * }
 * ```
 */
export type RootStackScreen<
    T extends keyof RootStackNavigatorParams,
    P = Record<string, never>
> = FC<RootStackProps<T> & P>

/**
 * Hook to access the navigation prop of the parent screen anywhere.
 * With correct typings for the Root Stack Navigator.
 */
export const useNavigation = () =>
    nativeUseNav<NavigationProp<RootStackNavigatorParams>>()
