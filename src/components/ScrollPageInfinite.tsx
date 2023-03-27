import React from "react"
import {
  RefreshControl,
  FlatList,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native"
import { Switch } from "react-native-switch"

import { Title, Subtitle } from "components/Text"
import { NavBar, NavbarProps } from "components/NavBar"
import { usePalette } from "utils/colors"
import { BoxShadowView } from "./BoxShadow"

interface PageProps<T> {
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
   * Margin above the title to leave space for the backdrop element.
   */
  scrollOffset?: number
  /**
   * Whether or not to show a toggle switch on the right of the title.
   *
   * If true, provide also the `switchControl` prop
   *
   * @default false
   */
  showSwitch?: boolean
  /**
   * Props for the toggle switch
   */
  switchControl?: {
    /** State of the switch */
    toggled: boolean
    /** Function fired when the state of the switch changes */
    onToggle: (value: boolean) => void
  }
  /**
   * props for the refresh control
   */
  refreshControl?: {
    onRefresh: () => void
    refreshing: boolean
  }
  /**
   * props to control the fetch of new data
   */
  fetchControl?: {
    onFetch: () => void
    /** @default false */
    fetching?: boolean
  }
  /**
   * List of items displayed in the flat list
   */
  items: T[]
  /**
   * Function used to render an item on the screen
   *
   * @param item
   * @return ReactElement created with the data of the item
   */
  render: (item: T, idx: number) => React.ReactElement
  /**
   * Number from 0 to 1 to control the `onEndReachedThreshold` prop of the flat list
   *
   * @default 0.05
   */
  endThreshold?: number

  children?: React.ReactNode
}

/**
 * General component useful for pages with an infinte scrollable content.
 * It provides a navbar and a flatlist with margin and rounded corners.
 */
export const ScrollPageInfinite = <T,>(props: PageProps<T>): JSX.Element => {
  const {
    background,
    backgroundSecondary,
    homeBackground,
    primary,
    palette,
    isLight,
  } = usePalette()

  const navbar = !props.hideNavbar

  const showHeader = props.title !== undefined

  const showSwitch = props.showSwitch ?? false

  const fetching = props.fetchControl?.fetching ?? false

  const endThreshold = props.endThreshold ?? 0.05

  return (
    <View style={{ flex: 1, backgroundColor: homeBackground }}>
      {props.backdropElement && (
        // element at the top of the screen, above the page
        <View
          style={{
            backgroundColor: homeBackground,
          }}
        >
          {props.backdropElement}
        </View>
      )}
      <BoxShadowView
        shadow={{
          color: isLight ? palette.primary : "#000",
          offset: { y: -8 },
          opacity: isLight ? 0.1 : 0.45,
          blur: isLight ? 19 : 32,
        }}
        // wrapper to make the borders of every child rounded
        style={{
          marginTop: 106 + (props.scrollOffset || 0),
        }}
        contentContainerStyle={{
          backgroundColor: background,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <FlatList
          data={props.items}
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: "hidden",
          }}
          renderItem={({ item, index }) => props.render(item, index)}
          onEndReached={props.fetchControl?.onFetch}
          onEndReachedThreshold={endThreshold}
          refreshControl={
            props.refreshControl ? (
              <RefreshControl
                refreshing={props.refreshControl.refreshing}
                onRefresh={props.refreshControl.onRefresh}
              />
            ) : undefined
          }
          stickyHeaderIndices={props.title ? [0] : undefined} // first child is the sticky header
          ListHeaderComponent={
            showHeader ? (
              // Sticky page header with the title, subtitle and toggle switch
              <View
                style={[
                  styles.header,
                  {
                    backgroundColor: background,
                  },
                ]}
              >
                <View>
                  <Title>{props.title}</Title>
                  {props.subtitle && <Subtitle>{props.subtitle}</Subtitle>}
                </View>
                {showSwitch && (
                  // Toggle switch
                  <View style={styles.switch}>
                    <Switch
                      value={props.switchControl?.toggled}
                      onValueChange={value => {
                        props.switchControl?.onToggle(value)
                      }}
                      changeValueImmediately={true}
                      renderActiveText={false}
                      renderInActiveText={false}
                      barHeight={27}
                      switchWidthMultiplier={3}
                      circleSize={18}
                      circleActiveColor={backgroundSecondary}
                      circleInActiveColor={palette.accent}
                      circleBorderWidth={0}
                      innerCircleStyle={{
                        borderWidth: 1,
                        borderColor: !props.switchControl?.toggled
                          ? palette.accent
                          : isLight
                          ? "#EBEBEB"
                          : "#3A4257",
                      }}
                      backgroundActive={palette.accent}
                      backgroundInactive={"#FFF"}
                      containerStyle={{
                        borderWidth: 1,
                        borderColor: palette.accent,
                      }}
                      switchLeftPx={1.5}
                      switchRightPx={1.3}
                    />
                  </View>
                )}
              </View>
            ) : undefined
          }
          ListFooterComponent={
            <ActivityIndicator
              size={"large"}
              animating={fetching}
              color={primary}
            />
          }
          contentContainerStyle={{
            backgroundColor: background,
            paddingTop: !showHeader ? 30 : 0,
            paddingBottom: 120,
          }}
        />
      </BoxShadowView>
      {navbar ? <NavBar {...props.navbarOptions} /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    zIndex: 1000,
    paddingHorizontal: 28,
    paddingVertical: 22,
    marginBottom: 16,
    flexDirection: "row",
  },
  backdrop: {
    zIndex: -1,
    height: 200,
    width: "100%",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  switch: {
    position: "absolute",
    alignSelf: "center",
    right: 5 + 28,
  },
})
