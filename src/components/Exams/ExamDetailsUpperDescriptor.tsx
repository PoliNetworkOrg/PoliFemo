import { FC } from "react"
import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import { Teaching } from "api/collections/exams"
import { getExamAcademicYearDescription, toPascalCase } from "utils/exams"
import { useCurrentLanguage } from "utils/language"

export interface ExamDetailsUpperDescriptorProps {
  teaching: Teaching
}

export const ExamDetailsUpperDescriptor: FC<
  ExamDetailsUpperDescriptorProps
> = props => {
  const teaching = props.teaching

  const { isLight, palette } = usePalette()

  const lan = useCurrentLanguage()
  return (
    <>
      <BodyText
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: isLight ? palette.variant3 : "#FFFFFF",
        }}
      >
        COD. {teaching.c_classe_m}
      </BodyText>
      <BodyText
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: isLight ? palette.variant3 : "#FFFFFF",
        }}
      >
        {getExamAcademicYearDescription(teaching, lan)}
      </BodyText>

      <BodyText
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: isLight ? palette.variant3 : "#FFFFFF",
          marginTop: 8,
        }}
      >
        Docenti responsabili
      </BodyText>
      <BodyText
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: isLight ? palette.variant3 : "#FFFFFF",
        }}
      >
        {toPascalCase(teaching.docente_esame)}
      </BodyText>
    </>
  )
}
