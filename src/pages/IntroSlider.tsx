import { FC } from "react"
import { StyleSheet, View, Text, Image } from "react-native"
import AppIntroSlider from "react-native-app-intro-slider"
import IIcon from "react-native-vector-icons/Ionicons"
import MIcon from "react-native-vector-icons/MaterialIcons"

const styles = StyleSheet.create({
  buttonCircle: {
    width: 40,
    height: 40,

    backgroundColor: "rgba(0, 0, 0, .8)",

    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    padding: 5,

    alignItems: "center",
    textAlign: "center",

    flex: 1,
  },
  title: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",

    flex: 1,
  },
  text: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",

    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    alignItems: "center",
    flex: 0,
  },
})

export const IntroSlider: FC<{
  onDone: () => void
}> = props => {
  return (
    <AppIntroSlider
      renderItem={({ item }) => (
        <View style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
          <Text style={styles.title}>{item.title}</Text>
          <Image style={styles.image} source={{ uri: item.image }} />
          <Text style={styles.text}>{item.text}</Text>
        </View>
      )}
      showSkipButton
      showPrevButton
      data={slides}
      bottomButton={false}
      activeDotStyle={{
        backgroundColor: "rgba(100, 200, 150, .9)",
      }}
      doneLabel={"Done"}
      nextLabel={"Next"}
      renderDoneButton={() => (
        <View style={styles.buttonCircle}>
          <IIcon name="md-checkmark" color="rgba(1, 255, 1, .9)" size={24} />
        </View>
      )}
      renderNextButton={() => (
        <View style={styles.buttonCircle}>
          <IIcon
            name="arrow-forward"
            color="rgba(255, 255, 255, .9)"
            size={24}
          />
        </View>
      )}
      renderPrevButton={() => (
        <View style={styles.buttonCircle}>
          <IIcon name="arrow-back" color="rgba(255, 255, 255, .9)" size={24} />
        </View>
      )}
      renderSkipButton={() => (
        <View style={styles.buttonCircle}>
          <MIcon name="last-page" color="rgba(220, 150, 220, .9)" size={24} />
        </View>
      )}
      onDone={() => props.onDone()}
    />
  )
}

const slides = [
  {
    key: "one",
    title: "Title 1",
    text: "Description.\nSay something cool",
    image:
      "https://thumbs.dreamstime.com/z/jour-de-terre-d-environnement-dans-les-mains-des-arbres-cultivant-jeunes-plantes-bokeh-verdissent-la-main-femelle-fond-tenant-l-130247647.jpg",
    backgroundColor: "#00ff0033",
  },
  {
    key: "two",
    title: "Title 2",
    text: "Other cool stuff",
    image:
      "https://thumbs.dreamstime.com/z/jour-de-terre-d-environnement-dans-les-mains-des-arbres-cultivant-jeunes-plantes-bokeh-verdissent-la-main-femelle-fond-tenant-l-130247647.jpg",
    backgroundColor: "#0000ff33",
  },
  {
    key: "three",
    title: "Rocket guy",
    text: "I'm already out of descriptions\n\nLorem ipsum bla bla bla",
    image:
      "https://thumbs.dreamstime.com/z/jour-de-terre-d-environnement-dans-les-mains-des-arbres-cultivant-jeunes-plantes-bokeh-verdissent-la-main-femelle-fond-tenant-l-130247647.jpg",
    backgroundColor: "#ff000033",
  },
]
