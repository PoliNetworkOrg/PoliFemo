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

export const getExamStatus = (
  exam: Exam
): { desc: string; isHighlighted: boolean } => {
  if (exam.inAttesaDiEsito) {
    return { desc: "In attesa di esito", isHighlighted: false }
  } else if (exam.hasIscrizioneConEsito) {
    return { desc: "Esito disponibile", isHighlighted: false }
  } else if (exam.hasIscrizioniAttive) {
    return { desc: "Iscritto", isHighlighted: true }
  } else if (!exam.iscrizioniAperte) {
    return { desc: "Iscrizioni chiuse", isHighlighted: false }
  } else {
    return { desc: "Iscrizioni aperte", isHighlighted: false }
  }
}
