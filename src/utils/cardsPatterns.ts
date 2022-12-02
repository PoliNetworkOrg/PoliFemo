/**
 * Type of a tuple that contains the height of a card
 * and the column in which it has to be inserted (left / right)
 */
export type CardData = [number, "left" | "right"]

/**
 * Type of an array that contains the data of multiple cards.
 */
export type CardsPattern = CardData[]

/**
 * Interface of an object that contains data to map a batch
 * with a given number of cards to a visual pattern
 */
export interface CardsPatterns {
    /** patterns used by the first batch of cards */
    first: { [key: number]: CardsPattern }
    /** patterns used by all the following batches of cards */
    other: { [key: number]: CardsPattern }
}

export const newsCategoryPatterns: CardsPatterns = {
    // first batch of news category cards
    first: {
        [1]: [[190, "left"]],
        [2]: [
            [274, "left"],
            [274, "right"],
        ],
        [3]: [
            [277, "right"],
            [130, "left"],
            [130, "left"],
        ],
        [4]: [
            [274, "left"],
            [193, "right"],
            [130, "left"],
            [211, "right"],
        ],
        [5]: [
            [304, "left"],
            [193, "right"],
            [207, "left"],
            [171, "right"],
            [130, "right"],
        ],
        [6]: [
            [274, "left"],
            [178, "right"],
            [147, "left"],
            [178, "right"],
            [147, "left"],
            [212, "right"],
        ],
    },
    // other batches of news category cards
    other: {
        [3]: [
            [277, "right"],
            [130, "left"],
            [130, "left"],
        ],
        [4]: [
            [244, "left"],
            [183, "right"],
            [160, "left"],
            [221, "right"],
        ],
        [5]: [
            [133, "left"],
            [193, "right"],
            [132, "left"],
            [221, "right"],
            [132, "left"],
        ],
    },
}
