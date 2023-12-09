import { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"

import { useNavigation } from "navigation/NavigationTypes"

import { ButtonInterface, ButtonType, MenuButton } from "./MenuButton"

import AsyncStorage from "@react-native-async-storage/async-storage"
import add from "assets/menu/add.svg"
import association from "assets/menu/association.svg"
import calendar from "assets/menu/calendar.svg"
import clock from "assets/menu/clock.svg"
import free_classrooms from "assets/menu/free_classrooms.svg"
import grading_book from "assets/menu/grading_book.svg"
import marks from "assets/menu/marks.svg"
import materials from "assets/menu/materials.svg"
import tests from "assets/menu/tests.svg"
import groups from "assets/menu/whatsapp.svg"
import { Modal } from "components/Modal"
import { useTranslation } from "react-i18next"
import { useOutsideClick } from "utils/outsideClick"

type ButtonState = ButtonInterface & { shown: boolean }

/**
 * the main menu of the app, an horizontal scroll view with the buttons to navigate to the different pages
 */
export const MainMenu = () => {
  const { navigate } = useNavigation()

  const defaultIcons: ButtonInterface[] = [
    {
      type: ButtonType.CALENDAR,
      title: "menu_calendar",
      icon: calendar,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.TIMETABLE,
      title: "menu_timetable",
      icon: clock,
      onClick: () => navigate("TimeTable"),
    },
    {
      type: ButtonType.ASSOCIATIONS,
      title: "menu_associations",
      icon: association,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.FREECLASSROOMS,
      title: "menu_freeclass",
      icon: free_classrooms,
      onClick: () => navigate("FreeClassrooms"),
    },
    {
      type: ButtonType.MATERIALS,
      title: "menu_materials",
      icon: materials,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.GROUPS,
      title: "menu_groups",
      icon: groups,
      onClick: () => navigate("Groups"),
    },
    {
      type: ButtonType.MARKS,
      title: "menu_marks",
      icon: marks,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.GRADING_BOOK,
      title: "menu_gradingBook",
      icon: grading_book,
      onClick: () => navigate("GradingBook"),
    },
    {
      type: ButtonType.TEST,
      title: "menu_test",
      icon: tests,
      onClick: () => navigate("Error404"),
    },
    {
      type: ButtonType.ADD,
      title: "menu_add",
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

  const { t } = useTranslation("home") //i18n hook

  const scrollView = useOutsideClick<ScrollView>(() => {
    setIsDeleting(false)
  }, isDeleting)

  useEffect(() => {
    scrollView.current?.scrollTo({ x: 0, y: 0, animated: true })
  }, [scrollView])

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
      <Modal
        centerText={false}
        title={"" + t("modal_add")}
        subTitle={"" + t("modal_message")}
        isShowing={isModalVisible}
        onClose={() => setModalVisible(false)}
        contentContainerStyle={{
          minHeight: 420,
        }}
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
              {triplet.map(buttonIcon => (
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
                  key={"menu_add_icon" + buttonIcon.type}
                  inMenu
                />
              ))}
            </View>
          ))}
        </View>
      </Modal>
      {icons
        .filter(i => i.shown)
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
              if (
                icons.filter(icon => icon.shown && icon.type !== ButtonType.ADD)
                  .length === 1
              ) {
                setIsDeleting(false)
              }
            }}
            key={"menu_" + buttonIcon.type}
          />
        ))}
    </ScrollView>
  )
}
