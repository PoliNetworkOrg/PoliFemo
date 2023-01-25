
/**
 * enum to differentiate the different types of widget we could have
 * different widget types have different background images
 */
export enum WidgetType {
    LECTURES = 1,
    EXAMS = 2,
    NEWS = 3,
    DEADLINE = 4,
    CUSTOM = 5,
}

export interface CarouselItem {
    /**
     * number to identify the object and the relative widget
     */
    id: number
    /**
     * enum field to identify the type of the widget
     */
    type: WidgetType
    /**
     * string to identify the date of the event(or deadline) contained in the widget
     */
    date: string
    /**
     * string to identify the time of the event(or deadline) contained in the widget
     */
    time: string
    /**
     * string to identify the title of the event contained in the widget
     */
    title: string
    /**
     * string to identify eventually the room when the event takes place
     */
    room?: string
}

export function formatTitle(str: string) {
    return str
        .split(" ")
        .map(item =>
            item.length > 3
                ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
                : item.toLowerCase()
        )
        .join(" ")
}