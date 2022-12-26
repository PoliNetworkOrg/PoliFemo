import { Tag, Article } from "api"

/**
 * Name of the event that has to be fired in order to update the preference
 * of a tag (favourite or not) in the state of the NewsManager component
 */
export const UPDATE_PREFERENCE_EVENT_NAME = "update-preference"

/** Enum to represent whether a tag is favourite or not */
export enum Preference {
    OTHER,
    FAVOURITE,
}

export type TagWithData = Tag & {
    /** The column in which the card has to be inserted */
    column: "left" | "right"
    /** The height of the card */
    height: number
    /** Whether the tag is favourite or not */
    preference: Preference
}

/**
 * Interface of an object that maps a tag name to its preference
 *
 * TODO: use tag id if and when there will be one
 */
export interface Preferences {
    [key: Tag["name"]]: Preference
}

/**
 * Interface of an object that maps a tag name to an article.
 *
 * TODO: use tag id if and when there will be one
 */
export interface LastArticles {
    [key: Tag["name"]]: Article
}

/**
 * Interface for the arguments of the function that is called
 * when the `update-preference` event is fired.
 */
export interface UpdatePreferenceEventArgs {
    tagName: Tag["name"]
    preference: Preference
}
