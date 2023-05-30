import { MainStackScreen } from "navigation/NavigationTypes"
import { Image } from "react-native"
import { ArticleDetailsWrapper } from "components/Home/News/ArticleDetailsWrapper"
import Markdown from "react-native-markdown-display"
import React from "react"
import { usePalette } from "utils/colors"
import { useCurrentLanguage } from "utils/articles"

declare module "react-native-markdown-display" {
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  interface MarkdownProps {
    children?: React.ReactNode
  }
}

export const Article: MainStackScreen<"Article"> = props => {
  const { isLight } = usePalette()

  const currentLanguage = useCurrentLanguage()

  const article = props.route.params.article

  const markdownStyle = {
    body: {
      fontSize: 16,
      marginBottom: -8,
      marginTop: -8,
      padding: 0,
      color: isLight ? "#000" : "#fff",
    },
    textgroup: { textAlign: "justify", width: "100%" },
  }

  const title =
    currentLanguage === "it"
      ? article.content.it.title
      : article.content.en.title

  const subtitle =
    currentLanguage === "it"
      ? article.content.it.subtitle
      : article.content.en.subtitle

  const content =
    currentLanguage === "it"
      ? article.content.it.content
      : article.content.en.content
  return (
    <ArticleDetailsWrapper
      navbarOptions={{ elevated: true }}
      title={title}
      subtitle={subtitle}
      backdropElement={
        article.image ? (
          <Image
            source={{
              uri: article.image,
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        ) : undefined
      }
    >
      <Markdown style={{ ...markdownStyle }}>{content}</Markdown>
    </ArticleDetailsWrapper>
  )
}
