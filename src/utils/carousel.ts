import { Event } from "api/event"
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

  isoDate: string
  /**
   * string to identify eventually the room when the event takes place
   */
  room?: string
}

/**
 * Function that helps to format the title of an Highlight. I decided to transform the entire title to lowercase
 * except for the first letter of each word with more than 3 characters.
 * @param title
 * @returns the transformed title
 */
export function formatTitle(title: string) {
  return title
    .split(" ")
    .map(item =>
      item.length > 3
        ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
        : item.toLowerCase()
    )
    .join(" ")
}

/**
 * Function that allows to check the event_type of an event. So far, we filter the events that are lectures, exams or deadlines.
 * @param typeId of the event
 * @returns true/false
 */
export function checkEventType(typeId: number) {
  return (
    typeId === WidgetType.LECTURES ||
    typeId === WidgetType.EXAMS ||
    typeId === WidgetType.DEADLINE
  )
}

export function createWidget(event: Event) {
  const days = [
    "Domenica",
    "Lunedì",
    "Martedì",
    "Mercoledì",
    "Giovedì",
    "Venerdì",
    "Sabato",
  ]
  const months = [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ]
  const dateObj = new Date(event.date_start)
  const resultDate =
    days[dateObj.getDay()] +
    " " +
    dateObj.getDate().toString().padStart(2, "0") +
    " " +
    months[dateObj.getMonth()] +
    " " +
    dateObj.getFullYear()
  const nextEvent: CarouselItem = {
    id: event.event_id,
    type: event.event_type.typeId,
    date: resultDate,
    time: event.date_start.toString().slice(11, 16),
    title: event.title.it,
    room: event.room?.acronym_dn,
    isoDate: event.date_start,
  }
  return nextEvent
}
