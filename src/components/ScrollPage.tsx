import React, { FC } from "react"
import { RefreshControl, ScrollView, View, Dimensions } from "react-native"

import { Title, Subtitle } from "components/Text"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"
import { LinearGradient } from "expo-linear-gradient"

/**
 * General component useful for pages with a scrollable content.
 * It provides a navbar and a scrollview with margin and rounded corners.
 */
export const ScrollPage: FC<{
  /**
   * Title in the sticky header.
   */
  title?: string
  /**
   * Subtitle in the sticky header.
   */
  subtitle?: string
  /**
   * Remove the navbar from the bottom of the page.
   */
  hideNavbar?: boolean
  /**
   * Props for the navbar, see {@link NavBar}
   */
  navbarOptions?: NavbarProps
  /**
   * Element to be put behind the page, the main content will scroll on top of it.
   */
  backdropElement?: React.ReactNode
  /**
   * props for the refresh control
   */
  refreshControl?: {
    onRefresh: () => void
    refreshing: boolean
  }
  children: React.ReactNode
}> = props => {
  const { background, isLight, primary } = usePalette()

  const navbar = !props.hideNavbar

  const { height, width } = Dimensions.get("window")

  const { articleTitle, articleSubtitle } = usePalette()
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isLight ? primary : background,
      }}
    >
      {isLight && (
        <LinearGradient
          colors={[
            "#424967",
            "rgba(66, 73, 103, 0.43)",
            "rgba(66, 73, 103, 0.252403)",
            "rgba(66, 73, 103, 0)",
          ]}
          style={{
            flex: 1,
            zIndex: 1,
            width: width,
            height: height,
            position: "absolute",
          }}
          locations={[0.04, 0.19, 0.55, 0.96]}
        />
      )}
      {!isLight && (
        <View
          style={{
            zIndex: 1,
            backgroundColor: "rgba(27, 33, 50, 0.63)",
            flex: 1,
            position: "absolute",
            top: 0,
            width: width,
            height: 230,
          }}
        />
      )}
      {props.backdropElement && (
        <View
          style={{
            height: 230,
            width: "100%",
            position: "absolute",
            top: 0,
            zIndex: 0,
          }}
        >
          {props.backdropElement}
        </View>
      )}

      <View
        style={{
          backgroundColor: background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: props.backdropElement ? 192 : 106,
          paddingHorizontal: 24,
          paddingTop: 30,
          zIndex: 2,
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            props.refreshControl ? (
              <RefreshControl
                refreshing={props.refreshControl.refreshing}
                onRefresh={props.refreshControl.onRefresh}
              />
            ) : undefined
          }
        >
          <View style={{ paddingHorizontal: 4, paddingBottom: 12 }}>
            <Title
              style={{
                fontSize: 42,
                fontFamily: "Roboto_900Black",
                color: articleTitle,
              }}
            >
              {props.title}
            </Title>
            {props.subtitle && (
              <Subtitle
                style={{
                  paddingLeft: 8,
                  paddingTop: 8,
                  color: articleSubtitle,
                }}
              >
                {props.subtitle}
              </Subtitle>
            )}
          </View>

          <View>{props.children}</View>
        </ScrollView>
      </View>

      {navbar ? <NavBar {...props.navbarOptions} /> : null}
    </View>
  )
}
