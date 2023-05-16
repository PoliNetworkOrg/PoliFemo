import { MainStackScreen } from "navigation/NavigationTypes"
import { Image } from "react-native"
import { ArticleWrapper } from "components/Home/News/ArticleWrapper"
import Markdown from "react-native-markdown-display"
import React from "react"
import { usePalette } from "utils/colors"

declare module "react-native-markdown-display" {
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  interface MarkdownProps {
    children?: React.ReactNode
  }
}

// ! This is not a very solid approach, should search for another library which supports <br> tag?
const preprocessMarkdown = (markdown: string) => {
  const replacedMarkdown = markdown.replace(/<br>/g, "\n")
  return replacedMarkdown
}

export const Article: MainStackScreen<"Article"> = props => {
  const { isLight } = usePalette()

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

  return (
    <ArticleWrapper
      navbarOptions={{ elevated: true }}
      title={article.title}
      subtitle={article.subtitle}
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
      <Markdown style={{ ...markdownStyle }}>
        {preprocessMarkdown(article.content)}
      </Markdown>
    </ArticleWrapper>
  )
}
