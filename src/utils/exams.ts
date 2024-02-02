import { Exam } from "api/collections/exams"

export const monthsAcronymsIT = [
  "GEN",
  "FEB",
  "MAR",
  "APR",
  "MAG",
  "GIU",
  "LUG",
  "AGO",
  "SET",
  "OTT",
  "NOV",
  "DIC",
]

export const monthsAcronymsEN = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
]

export enum ExamStatusType {
  ISCRITTO,
  ISCRIZIONI_APERTE,
  ISCRIZIONI_CHIUSE,
  ESITO_DISPONIBILE,
  IN_ATTESA_DI_ESITO,
}

export const getExamStatus = (
  exam: Exam
): { type: ExamStatusType; isHighlighted: boolean } => {
  if (exam.inAttesaDiEsito) {
    return { type: ExamStatusType.IN_ATTESA_DI_ESITO, isHighlighted: false }
  } else if (exam.hasIscrizioneConEsito) {
    return { type: ExamStatusType.ESITO_DISPONIBILE, isHighlighted: false }
  } else if (exam.hasIscrizioniAttive) {
    return { type: ExamStatusType.ISCRITTO, isHighlighted: true }
  } else if (exam.iscrizioniAperte) {
    return { type: ExamStatusType.ISCRIZIONI_APERTE, isHighlighted: false }
  } else {
    return { type: ExamStatusType.ISCRIZIONI_CHIUSE, isHighlighted: false }
  }
}

export const getExamStatusDescription = (type: ExamStatusType, lan: string) => {
  switch (type) {
    case ExamStatusType.ISCRITTO:
      return lan === "it" ? "Iscritto" : "Enrolled"
    case ExamStatusType.ISCRIZIONI_APERTE:
      return lan === "it" ? "Iscrizioni aperte" : "Open for enrollment"
    case ExamStatusType.ISCRIZIONI_CHIUSE:
      return lan === "it" ? "Iscrizioni chiuse" : "Enrollment closed"
    case ExamStatusType.ESITO_DISPONIBILE:
      return lan === "it" ? "Esito disponibile" : "Result available"
    case ExamStatusType.IN_ATTESA_DI_ESITO:
      return lan === "it" ? "In attesa di esito" : "Waiting for result"
  }
}
