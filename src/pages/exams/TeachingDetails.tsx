import { MainStackScreen, useNavigation } from "navigation/NavigationTypes"

import { BodyText } from "components/Text"

import { PageWrap } from "components/PageLayout"

import { HttpClient } from "api/HttpClient"

import { useCurrentLanguage } from "utils/language"

/* let searchTimeout: NodeJS.Timeout
const deltaTime = 200 //ms */

enum ExamsStage {
  START,
  TOKEN_FETCHING,
  TOKEN_RETRIEVED,
  ERROR_NOT_LOGGED_IN,
}

const client = HttpClient.getInstance()

export const TeachingDetails: MainStackScreen<"TeachingDetails"> = props => {
  /* const { t } = useTranslation("exams") */

  const teaching = props.route.params.teaching

  const lan = useCurrentLanguage()

  const { navigate } = useNavigation()

  return (
    <PageWrap title={teaching.xdescrizione}>
      <BodyText>{teaching.xdescrizione}</BodyText>
    </PageWrap>
  )
}
