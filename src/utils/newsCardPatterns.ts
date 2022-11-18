/** Type of an array containing the data needed to display a specific pattern of cards.
 *
 * Each piece of data is a tuple that contains the height of the
 * corresponding card and the column in which it has to be inserted (left / right)
 */
export type NewsCardsPattern = [number, "left" | "right"][]

export interface AllNewsCardsPatterns {
    /** patterns used by the first batch of cards */
    start: { [key: number]: NewsCardsPattern }
    /** patterns used by all the following batches of cards */
    other: { [key: number]: NewsCardsPattern }
}

/**
 * An hardcoded object that contains data to map a batch
 * of news category cards to a specific visual pattern.
 */
export const allNewsCardsPatterns: AllNewsCardsPatterns = {
    start: {
        [1]: [[190, "left"]],
        [2]: [
            [274, "left"],
            [274, "right"],
        ],
        [3]: [
            [277, "left"],
            [130, "right"],
            [130, "right"],
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
