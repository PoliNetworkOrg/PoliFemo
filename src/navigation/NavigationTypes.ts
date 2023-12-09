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

import {
  CompositeScreenProps,
  NavigationContainerRef,
  NavigationProp,
  NavigatorScreenParams,
  useNavigation as nativeUseNav,
} from "@react-navigation/native"
import { StackScreenProps } from "@react-navigation/stack"
import { Article } from "api/collections/articles"
import { Occupancies } from "api/collections/rooms"
import {
  BuildingItem,
  CampusItem,
  HeadquarterItem,
} from "components/FreeClass/DefaultList"
import { TagWithData } from "contexts/newsPreferences"
import {
  NotificationStorage,
  ValidChannelId,
} from "notifications/NotificationTypes"
import { FC, createRef } from "react"
import { ValidAcronym } from "utils/rooms"

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
  MainNav: NavigatorScreenParams<MainStackNavigatorParams>
  SettingsNav: NavigatorScreenParams<SettingsStackNavigatorParams>
  Login: undefined
}

export type MainStackNavigatorParams = {
  Home: undefined
  GlobalSearch: undefined
  Article: { article: Article }
  ArticlesList: { tagName: string }
  OtherCategories: { tags: TagWithData[] }
  Error404: undefined
  FreeClassrooms: undefined
  HeadquarterChoice: undefined
  CampusChoice: {
    headquarter: HeadquarterItem
  }
  PositionChoice: undefined
  BuildingChoice: {
    campus: CampusItem
  }
  RoomDetails: {
    startDate: string
    roomId: number
    roomLatitude?: number
    roomLongitude?: number
    occupancies: Occupancies
    occupancyRate?: number | null
    acronymList?: ValidAcronym[]
  }
  ClassChoice: {
    building: BuildingItem
  }
  Groups: undefined
  Notifications: undefined
  TimeTable: undefined
  NotificationsCategory: {
    category: string
    channelId: ValidChannelId
  }
  NotificationDetails: { notification: NotificationStorage; category?: string }
  GradingBook: undefined
}

export type SettingsStackNavigatorParams = {
  Settings: undefined
  About: undefined
  Licenses: undefined
  Privacy: undefined
}

export type GlobalStackNavigatorParams = RootStackNavigatorParams &
  MainStackNavigatorParams &
  SettingsStackNavigatorParams

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

export type MainStackProps<T extends keyof MainStackNavigatorParams> =
  CompositeScreenProps<
    StackScreenProps<MainStackNavigatorParams, T>,
    StackScreenProps<RootStackNavigatorParams>
  >

export type SettingsStackProps<T extends keyof SettingsStackNavigatorParams> =
  CompositeScreenProps<
    StackScreenProps<SettingsStackNavigatorParams, T>,
    StackScreenProps<RootStackNavigatorParams>
  >

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

export type MainStackScreen<
  T extends keyof MainStackNavigatorParams,
  P = Record<string, never>
> = FC<MainStackProps<T> & P>

export type SettingsStackScreen<
  T extends keyof SettingsStackNavigatorParams,
  P = Record<string, never>
> = FC<SettingsStackProps<T> & P>
/**
 * Hook to access the navigation prop of the parent screen anywhere.
 * With correct typings.
 *
 * Currently, there are pages in two navigators (SettingsNav, MainNav)
 *
 * To navigate to a screen in the SAME Navigator, do as usual (you can
 * specify only the page and params if needed):
 *
 *```tsx
 * navigate = useNavigation()
 *
 * navigate("Article" , {article : article})
 *
 *```
 * To navigate to a screen in a DIFFERENT Navigator, you need to specify
 * the navigator hierarchy:
 *
 *```tsx
 * navigate = useNavigation()
 *
 * navigate("SettingsNav", {
 *            screen: "Settings",
 *            params: { user: mockedUser },
 *         })
 *
 *```
 * Here, `SettingsNav` is the name of the navigator, which need to be specified.
 *
 */
export const useNavigation = () =>
  nativeUseNav<NavigationProp<GlobalStackNavigatorParams>>()

//call navigate() from outside a page
export const navigationRef =
  createRef<NavigationContainerRef<RootStackNavigatorParams>>()
