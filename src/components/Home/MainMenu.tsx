import { FC, useEffect, useState } from "react"
import { ScrollView, View } from "react-native"

import { useNavigation } from "navigation/NavigationTypes"

import { MenuButton, ButtonInterface, ButtonType } from "./MenuButton"

import calendar from "assets/menu/calendar.svg"
import clock from "assets/menu/clock.svg"
import association from "assets/menu/association.svg"
import free_classrooms from "assets/menu/free_classrooms.svg"
import materials from "assets/menu/materials.svg"
import groups from "assets/menu/whatsapp.svg"
import marks from "assets/menu/marks.svg"
import grading_book from "assets/menu/grading_book.svg"
import tests from "assets/menu/tests.svg"
import add from "assets/menu/add.svg"
import { ModalCustom } from "components/Modal"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useOutsideClick } from "utils/outsideClick"

type ButtonState = ButtonInterface & { shown: boolean }

/**
 * the main menu of the app, an horizontal scroll view with the buttons to navigate to the different pages
 */
export const MainMenu: FC<{ filter?: string }> = ({ filter }) => {
  const { navigate } = useNavigation()

  const defaultIcons: ButtonInterface[] = [
    {
      type: ButtonType.CALENDAR,
      title: "Calendario",
      icon: calendar,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.TIMETABLE,
      title: "Orario Lezioni",
      icon: clock,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.ASSOCIATIONS,
      title: "PoliAssociazioni",
      icon: association,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.FREECLASSROOMS,
      title: "Aule Libere",
      icon: free_classrooms,
      onClick: () => navigate("FreeClassrooms"),
    },
    {
      type: ButtonType.MATERIALS,
      title: "Materiali",
      icon: materials,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.GROUPS,
      title: "Gruppi",
      icon: groups,
      onClick: () => navigate("Groups"),
    },
    {
      type: ButtonType.MARKS,
      title: "Valutazioni",
      icon: marks,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.GRADING_BOOK,
      title: "Libretto",
      icon: grading_book,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.TEST,
      title: "Test e Prove",
      icon: tests,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.ADD,
      title: "Aggiungi",
      icon: add,
      onClick: () => setModalVisible(true),
    },
  ]

  const [icons, setIcons] = useState<ButtonState[]>(
    defaultIcons.map(icon =>
      icon.type === ButtonType.ADD
        ? { ...icon, shown: false }
        : { ...icon, shown: true }
    )
  )

  const [isModalVisible, setModalVisible] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const scrollView = useOutsideClick<ScrollView>(() => {
    setIsDeleting(false)
  }, isDeleting)

  useEffect(() => {
    scrollView.current?.scrollTo({ x: 0, y: 0, animated: true })
  }, [filter, scrollView])

  useEffect(() => {
    AsyncStorage.getItem("menu:icons")
      .then(iconJSON => {
        if (iconJSON) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const showns: ButtonType[] = JSON.parse(iconJSON)
          setIcons(
            icons.map(icon => ({
              ...icon,
              shown: showns.includes(icon.type),
            }))
          )
        }
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    const visibleIcons = icons.filter(icon => icon.shown)
    if (visibleIcons.length === icons.length) {
      icons[9].shown = false
      setModalVisible(false)
    }
    AsyncStorage.setItem(
      "menu:icons",
      JSON.stringify(icons.filter(i => i.shown).map(i => i.type))
    ).catch(err => console.log(err))
  }, [icons])

  // divide iconsToAdd in triplets
  const triplets = icons
    .filter(i => !i.shown)
    .reduce((acc, cur, i) => {
      if (i % 3 === 0) {
        acc.push([cur])
      } else {
        acc[acc.length - 1].push(cur)
      }
      return acc
    }, [] as ButtonInterface[][])

  return (
    <ScrollView
      ref={scrollView}
      horizontal
      contentContainerStyle={{ paddingHorizontal: 21, marginTop: 5 }}
      showsHorizontalScrollIndicator={false}
    >
      <ModalCustom
        centerText={false}
        title={"Aggiungi features"}
        subTitle={"Personalizza la tua bacheca"}
        isShowing={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View
          style={{
            alignItems: "center",
            marginTop: 6,
          }}
        >
          {triplets.map((triplet, i) => (
            <View
              key={"menu_add_row" + i}
              style={{
                flexDirection: "row",
                marginVertical: 6,
                width: 288,
              }}
            >
              {triplet.map((buttonIcon, index) => (
                <MenuButton
                  onPress={() => {
                    setIcons(
                      icons.map(i =>
                        i.type === buttonIcon.type ? { ...i, shown: true } : i
                      )
                    )
                  }}
                  buttonIcon={buttonIcon}
                  isDeleting={false}
                  key={"menu_add_icon" + index}
                  inMenu
                />
              ))}
            </View>
          ))}
        </View>
      </ModalCustom>
      {icons
        .filter(i => i.shown)
        .filter(
          i =>
            i.type === ButtonType.ADD ||
            (filter
              ? i.title.toLowerCase().includes(filter.toLowerCase())
              : true)
        )
        .map(buttonIcon => (
          <MenuButton
            onPress={() => {
              if (isDeleting) setIsDeleting(false)
              else {
                buttonIcon.onClick?.()
              }
            }}
            onLongPress={() => {
              if (buttonIcon.type !== ButtonType.ADD) setIsDeleting(!isDeleting)
            }}
            buttonIcon={buttonIcon}
            isDeleting={isDeleting}
            onDelete={() => {
              const { type } = buttonIcon
              setIcons(
                icons.map(i =>
                  i.type === ButtonType.ADD && !i.shown
                    ? { ...i, shown: true }
                    : i.type === type
                    ? { ...i, shown: false }
                    : i
                )
              )
            }}
            key={"menu_" + buttonIcon.type}
          />
        ))}
    </ScrollView>
  )
}
