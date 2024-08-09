import { FC } from "react"
import { BodyText } from "components/Text"
import { usePalette } from "utils/colors"
import { getExamAcademicYearDescription, toPascalCase } from "utils/exams"
import { useCurrentLanguage } from "utils/language"

export interface ExamDetailsUpperDescriptorProps {
  teachingCode: number
  teacher: string
  currentYear: string
  academicYear: number
  semester: string
}

export const ExamDetailsUpperDescriptor: FC<
  ExamDetailsUpperDescriptorProps
> = props => {
  const { teachingCode, teacher, currentYear, academicYear, semester } = props

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
        COD. {teachingCode}
      </BodyText>
      <BodyText
        style={{
          fontSize: 14,
          fontWeight: "400",
          color: isLight ? palette.variant3 : "#FFFFFF",
        }}
      >
        {getExamAcademicYearDescription(
          currentYear,
          academicYear,
          semester,
          lan,
        )}
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
        {toPascalCase(teacher)}
      </BodyText>
    </>
  )
}
