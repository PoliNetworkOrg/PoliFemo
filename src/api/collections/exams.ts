/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { AuthType, HttpClient, RequestOptions } from "api/HttpClient"
import { mapAxiosRequest } from "api/mapAxiosRequest"

const client = HttpClient.getInstance()

export interface Exam {
  c_appello: number
  d_app: string
  ora_ok: string
  t_appello: string
  d_apertura: string
  d_chiusura: string
  d_inizio_sessione: string
  d_fine_sessione: string
  domanda_valida: string
  c_domanda: number
  domanda_ateneo_valida: string
  c_domanda_ateneo: number | null
  numIscrittiAppello: number
  risposteDomanda: unknown // ?
  risposteDomandaAteneo: unknown // ?
  descTipoAppello: string
  xaula: string
  xvisibil_appello_listainsegnamenti: boolean
  hasIscrizioneConEsito: boolean
  hasQuestionarioObblig: boolean
  appelloConDomanda: boolean
  iscrizioneAttiva?: ActiveSubscription
  oggiBeforeAppello: boolean
  iscrizioniAperteConRiserva: boolean
  hasIscrizioniAttive: boolean
  appelloConDomandaAteneo: boolean
  prenotazioneAppelloStraordinario: boolean
  appelloStraordinario: boolean
  xh_appello: string
  xdomanda: string
  xdomanda_ateneo: unknown // ?
  inAttesaDiEsito: boolean
  xnoteAppello: string[]
  iscrizioniAperte: boolean
}

export interface Teaching {
  c_classe_m: number
  ac_freq: number
  semestre_freq: string
  c_insegn_piano: string
  docente_esame: string
  docente_esame_mail: string | null
  aa_freq: string
  aa_classe: string
  posins: string
  warning_esame: string | null
  appelliEsame: Exam[]
  xdescrizione: string
}

export interface ReducedTeachingExam {
  teachingName: string
  teachingCode: number
  teacher: string
  academicYear: number
  currentYear: string
  semester: string
  result: Exam
}

export interface Correction {
  ed_compito_id: number
  id_doc_compito: number
  nome_doc_compito: string
}

export interface ActiveSubscription {
  c_iscriz: number
  c_risposta: unknown // ?
  c_risposta_ateneo: unknown // ?
  n_protocollo: number
  show_prove_distanza: string
  verb_id_valutazione: number | null
  verb_esito: string | null
  verb_stato: string | null
  verb_positivo: string | null
  verb_esito_number: number | null
  verb_data_fine_pubblicazione: string | null
  verb_messaggio: string | null
  verb_mail_docente: string | null
  verb_data_rifiuto: string | null
  verb_esito_rifiuto: string | null
  verb_msg_sospeso: string | null
  verb_comunicazione_id: unknown // ?
  xrisposta_ateneo: unknown // ?
  hasCorrezioni: boolean
  xverbEsito: string | null
  hasEsito: boolean
  xverbStatoDesc: string | null
  xrisposta: unknown // ?
  rifiutabile: boolean
}

interface TeachingResponseData {
  MESSAGES: unknown[] // ?
  INSEGN: Teaching[]
}

// ! REMOVE AFTER DEBUG
export const fakeTeachings: () => Promise<Teaching[]> = () => {
  return Promise.resolve([
    {
      c_classe_m: 810352,
      ac_freq: 3,
      semestre_freq: "1",
      c_insegn_piano: "052510",
      docente_esame: "CUGOLA GIANPAOLO SAVERIO",
      docente_esame_mail: null,
      aa_freq: "2023",
      aa_classe: "2023",
      posins: "-",
      warning_esame: null,
      appelliEsame: [
        {
          c_appello: 820918,
          d_app: "2024-01-15T08:30:00.000+0100",
          ora_ok: "S",
          t_appello: "E",
          d_apertura: "2023-11-27T00:00:00.000+0100",
          d_chiusura: "2024-01-10T00:00:00.000+0100",
          d_inizio_sessione: "2024-01-08T00:00:00.000+0100",
          d_fine_sessione: "2024-02-17T00:00:00.000+0100",
          domanda_valida: "N",
          c_domanda: 0,
          domanda_ateneo_valida: "N",
          c_domanda_ateneo: null,
          numIscrittiAppello: 152,
          risposteDomanda: null,
          risposteDomandaAteneo: null,
          descTipoAppello: "Esame",
          xaula:
            "Cognomi da P a Scianna in aula  T.1.1, da Sciaranna a Z in T.1.2",
          xvisibil_appello_listainsegnamenti: true,
          hasIscrizioneConEsito: true,
          hasQuestionarioObblig: true,
          appelloConDomanda: false,
          iscrizioneAttiva: {
            c_iscriz: 9880998,
            c_risposta: null,
            c_risposta_ateneo: null,
            n_protocollo: 451697,
            show_prove_distanza: "N",
            verb_id_valutazione: 7061242,
            verb_esito: "RF",
            verb_stato: "P",
            verb_positivo: "N",
            verb_esito_number: null,
            verb_data_fine_pubblicazione: "2024-01-26T12:00:00.000+0100",
            verb_messaggio:
              '<p>Gentile studente, <br /><br />Le comunico che ho pubblicato gli esiti relativi all\'insegnamento 052510 - Ingegneria del software, A.A. 2023, Esame del 15/01/2024.<br /><br />La fase di pubblicazione si chiuder&agrave; in data 26/01/2024 12:00, dopodich&eacute; proceder&ograve; con il consolidamento degli esiti e la conseguente verbalizzazione.</p>\r\n<p>Per gli studenti di Laurea Magistrale con esame "Ingegneria del Software B", a meno di rifiuto del voto da parte vostra, al termine della fase di pubblicazione rettificher&ograve; il risultato segnandovi "assenti" in attesa del completamento del progetto.&nbsp;<br /><br />Pu&ograve; visualizzare la versione scannerizzata e commentata del suo compito accedendo ai servizi online (per ogni zona evidenziata c\'&egrave; un breve commento, se non riuscisse a visualizzarlo provi a scaricare il pdf e ad aprirlo con un diverso viewer).</p>\r\n<p>Se avesse necessit&agrave; di ulteriori chiarimenti venga <strong>Gioved&igrave; 25/1 alle ore 8.45 in aula Beta</strong>, al piano terra dell\'edificio 24, in via Golgi 40.<br /><br />Cordiali Saluti Prof. Cugola Gianpaolo Saverio<br /><br /><strong>Attenzione:</strong> messaggio automatico, non rispondere a questa mail.<br /><br /><br /></p>',
            verb_mail_docente: "gianpaolo.cugola@polimi.it",
            verb_data_rifiuto: "2024-01-24T00:52:43.000+0100",
            verb_esito_rifiuto: "24",
            verb_msg_sospeso: null,
            verb_comunicazione_id: null,
            xrisposta_ateneo: null,
            hasCorrezioni: true,
            xverbEsito: "RIFIUTATO",
            hasEsito: true,
            xverbStatoDesc: "PUBBLICATO",
            xrisposta: null,
            rifiutabile: false,
          },
          oggiBeforeAppello: false,
          iscrizioniAperteConRiserva: false,
          hasIscrizioniAttive: true,
          appelloConDomandaAteneo: false,
          prenotazioneAppelloStraordinario: false,
          appelloStraordinario: false,
          xh_appello: "08:30",
          xdomanda: "",
          xdomanda_ateneo: null,
          inAttesaDiEsito: false,
          xnoteAppello: [],
          iscrizioniAperte: false,
        },
        {
          c_appello: 820919,
          d_app: "2024-01-27T08:30:00.000+0100",
          ora_ok: "S",
          t_appello: "E",
          d_apertura: "2023-11-27T00:00:00.000+0100",
          d_chiusura: "2024-01-10T00:00:00.000+0100",
          d_inizio_sessione: "2024-01-08T00:00:00.000+0100",
          d_fine_sessione: "2024-02-17T00:00:00.000+0100",
          domanda_valida: "N",
          c_domanda: 0,
          domanda_ateneo_valida: "N",
          c_domanda_ateneo: null,
          numIscrittiAppello: 152,
          risposteDomanda: null,
          risposteDomandaAteneo: null,
          descTipoAppello: "Esame",
          xaula:
            "Cognomi da P a Scianna in aula  T.1.1, da Sciaranna a Z in T.1.2",
          xvisibil_appello_listainsegnamenti: true,
          hasIscrizioneConEsito: true,
          hasQuestionarioObblig: true,
          appelloConDomanda: false,
          iscrizioneAttiva: {
            c_iscriz: 9880998,
            c_risposta: null,
            c_risposta_ateneo: null,
            n_protocollo: 451697,
            show_prove_distanza: "N",
            verb_id_valutazione: 7061242,
            verb_esito: "RF",
            verb_stato: "P",
            verb_positivo: "N",
            verb_esito_number: null,
            verb_data_fine_pubblicazione: "2024-01-26T12:00:00.000+0100",
            verb_messaggio:
              '<p>Gentile studente, <br /><br />Le comunico che ho pubblicato gli esiti relativi all\'insegnamento 052510 - Ingegneria del software, A.A. 2023, Esame del 15/01/2024.<br /><br />La fase di pubblicazione si chiuder&agrave; in data 26/01/2024 12:00, dopodich&eacute; proceder&ograve; con il consolidamento degli esiti e la conseguente verbalizzazione.</p>\r\n<p>Per gli studenti di Laurea Magistrale con esame "Ingegneria del Software B", a meno di rifiuto del voto da parte vostra, al termine della fase di pubblicazione rettificher&ograve; il risultato segnandovi "assenti" in attesa del completamento del progetto.&nbsp;<br /><br />Pu&ograve; visualizzare la versione scannerizzata e commentata del suo compito accedendo ai servizi online (per ogni zona evidenziata c\'&egrave; un breve commento, se non riuscisse a visualizzarlo provi a scaricare il pdf e ad aprirlo con un diverso viewer).</p>\r\n<p>Se avesse necessit&agrave; di ulteriori chiarimenti venga <strong>Gioved&igrave; 25/1 alle ore 8.45 in aula Beta</strong>, al piano terra dell\'edificio 24, in via Golgi 40.<br /><br />Cordiali Saluti Prof. Cugola Gianpaolo Saverio<br /><br /><strong>Attenzione:</strong> messaggio automatico, non rispondere a questa mail.<br /><br /><br /></p>',
            verb_mail_docente: "gianpaolo.cugola@polimi.it",
            verb_data_rifiuto: "2024-01-24T00:52:43.000+0100",
            verb_esito_rifiuto: "30",
            verb_msg_sospeso: null,
            verb_comunicazione_id: null,
            xrisposta_ateneo: null,
            hasCorrezioni: true,
            xverbEsito: "RIFIUTATO",
            hasEsito: true,
            xverbStatoDesc: "PUBBLICATO",
            xrisposta: null,
            rifiutabile: false,
          },
          oggiBeforeAppello: false,
          iscrizioniAperteConRiserva: false,
          hasIscrizioniAttive: true,
          appelloConDomandaAteneo: false,
          prenotazioneAppelloStraordinario: false,
          appelloStraordinario: false,
          xh_appello: "08:30",
          xdomanda: "",
          xdomanda_ateneo: null,
          inAttesaDiEsito: false,
          xnoteAppello: [],
          iscrizioniAperte: false,
        },
      ],
      xdescrizione: "INGEGNERIA DEL SOFTWARE",
    },
    {
      c_classe_m: 811114,
      ac_freq: 3,
      semestre_freq: "1",
      c_insegn_piano: "085877",
      docente_esame: "PALERMO GIANLUCA",
      docente_esame_mail: null,
      aa_freq: "2023",
      aa_classe: "2023",
      posins: "-",
      warning_esame: null,
      appelliEsame: [
        {
          c_appello: 821002,
          d_app: "2024-01-26T08:30:00.000+0100",
          ora_ok: "S",
          t_appello: "E",
          d_apertura: "2023-12-05T00:00:00.000+0100",
          d_chiusura: "2024-01-23T00:00:00.000+0100",
          d_inizio_sessione: "2024-01-08T00:00:00.000+0100",
          d_fine_sessione: "2024-02-17T00:00:00.000+0100",
          domanda_valida: "N",
          c_domanda: 0,
          domanda_ateneo_valida: "N",
          c_domanda_ateneo: null,
          numIscrittiAppello: 176,
          risposteDomanda: null,
          risposteDomandaAteneo: null,
          descTipoAppello: "Esame",
          xaula: "Cognomi da P a Sch in aula 9.0.1, da Sci a Z in 9.1.2",
          xvisibil_appello_listainsegnamenti: true,
          hasIscrizioneConEsito: false,
          hasQuestionarioObblig: true,
          appelloConDomanda: false,
          iscrizioneAttiva: {
            c_iscriz: 9881005,
            c_risposta: null,
            c_risposta_ateneo: null,
            n_protocollo: 5479,
            show_prove_distanza: "N",
            verb_id_valutazione: null,
            verb_esito: null,
            verb_stato: null,
            verb_positivo: null,
            verb_esito_number: null,
            verb_data_fine_pubblicazione: null,
            verb_messaggio: null,
            verb_mail_docente: null,
            verb_data_rifiuto: null,
            verb_esito_rifiuto: null,
            verb_msg_sospeso: null,
            verb_comunicazione_id: null,
            xrisposta_ateneo: null,
            hasCorrezioni: false,
            xverbEsito: null,
            hasEsito: false,
            xverbStatoDesc: null,
            xrisposta: null,
            rifiutabile: false,
          },
          oggiBeforeAppello: false,
          iscrizioniAperteConRiserva: false,
          hasIscrizioniAttive: true,
          appelloConDomandaAteneo: false,
          prenotazioneAppelloStraordinario: false,
          appelloStraordinario: false,
          xh_appello: "08:30",
          xdomanda: "",
          xdomanda_ateneo: null,
          inAttesaDiEsito: true,
          xnoteAppello: [],
          iscrizioniAperte: false,
        },
      ],
      xdescrizione: "RETI LOGICHE",
    },
    {
      c_classe_m: 8097,
      ac_freq: 3,
      semestre_freq: "1",
      c_insegn_piano: "056889",
      docente_esame: "PIERLUCA",
      docente_esame_mail: null,
      aa_freq: "2023",
      aa_classe: "2023",
      posins: "-",
      warning_esame: null,
      appelliEsame: [
        {
          c_appello: 82725,
          d_app: "2024-02-06T15:00:00.000+0100",
          ora_ok: "S",
          t_appello: "E",
          d_apertura: "2023-11-27T00:00:00.000+0100",
          d_chiusura: "2024-02-01T00:00:00.000+0100",
          d_inizio_sessione: "2024-01-08T00:00:00.000+0100",
          d_fine_sessione: "2024-02-17T00:00:00.000+0100",
          domanda_valida: "N",
          c_domanda: 0,
          domanda_ateneo_valida: "N",
          c_domanda_ateneo: null,
          numIscrittiAppello: 75,
          risposteDomanda: null,
          risposteDomandaAteneo: null,
          descTipoAppello: "Esame",
          xaula: "Informazioni non ancora disponibili/pubblicate",
          xvisibil_appello_listainsegnamenti: true,
          hasIscrizioneConEsito: false,
          hasQuestionarioObblig: true,
          appelloConDomanda: false,
          iscrizioneAttiva: {
            c_iscriz: 100394,
            c_risposta: null,
            c_risposta_ateneo: null,
            n_protocollo: 7229,
            show_prove_distanza: "N",
            verb_id_valutazione: null,
            verb_esito: null,
            verb_stato: null,
            verb_positivo: null,
            verb_esito_number: null,
            verb_data_fine_pubblicazione: null,
            verb_messaggio: null,
            verb_mail_docente: null,
            verb_data_rifiuto: null,
            verb_esito_rifiuto: null,
            verb_msg_sospeso: null,
            verb_comunicazione_id: null,
            xrisposta_ateneo: null,
            hasCorrezioni: false,
            xverbEsito: null,
            hasEsito: false,
            xverbStatoDesc: null,
            xrisposta: null,
            rifiutabile: false,
          },
          oggiBeforeAppello: true,
          iscrizioniAperteConRiserva: true,
          hasIscrizioniAttive: true,
          appelloConDomandaAteneo: false,
          prenotazioneAppelloStraordinario: false,
          appelloStraordinario: false,
          xh_appello: "15:00",
          xdomanda: "",
          xdomanda_ateneo: null,
          inAttesaDiEsito: false,
          xnoteAppello: [],
          iscrizioniAperte: true,
        },
        {
          c_appello: 825,
          d_app: "2024-02-06T15:00:00.000+0100",
          ora_ok: "S",
          t_appello: "E",
          d_apertura: "2023-11-27T00:00:00.000+0100",
          d_chiusura: "2024-02-01T00:00:00.000+0100",
          d_inizio_sessione: "2024-01-08T00:00:00.000+0100",
          d_fine_sessione: "2024-02-17T00:00:00.000+0100",
          domanda_valida: "N",
          c_domanda: 0,
          domanda_ateneo_valida: "N",
          c_domanda_ateneo: null,
          numIscrittiAppello: 75,
          risposteDomanda: null,
          risposteDomandaAteneo: null,
          descTipoAppello: "Esame",
          xaula: "Informazioni non ancora disponibili/pubblicate",
          xvisibil_appello_listainsegnamenti: true,
          hasIscrizioneConEsito: false,
          hasQuestionarioObblig: true,
          appelloConDomanda: false,
          iscrizioneAttiva: undefined,
          oggiBeforeAppello: true,
          iscrizioniAperteConRiserva: true,
          hasIscrizioniAttive: false,
          appelloConDomandaAteneo: false,
          prenotazioneAppelloStraordinario: false,
          appelloStraordinario: false,
          xh_appello: "15:00",
          xdomanda: "",
          xdomanda_ateneo: null,
          inAttesaDiEsito: false,
          xnoteAppello: [],
          iscrizioniAperte: true,
        },
      ],
      xdescrizione: "FOUNDATIONS OF ARTIFICIAL INTELLIGENCE",
    },
  ])
}

export const exams = {
  getTeachings(options?: RequestOptions) {
    const url = "/rest/v1/insegn?lang=IT"
    const request = client.callPolimiExams<TeachingResponseData>({
      url,
      method: "GET",
      authType: AuthType.POLIMI_EXAMS,
      ...options,
    })
    return mapAxiosRequest(request, response => response.INSEGN)
  },
  getCorrection(c_appello: number, options?: RequestOptions) {
    const url = `/rest/v1/prove/correzioni/${c_appello}`
    const request = client.callPolimiExams<Correction>({
      url,
      method: "GET",
      authType: AuthType.POLIMI_EXAMS,
      ...options,
    })
    return mapAxiosRequest(request, response => response)
  },
  downloadFile(id_doc_compito: number, options?: RequestOptions) {
    const url = `/rest/v1/prove/correzione/${id_doc_compito}`
    const request = client.callPolimiExams<string>({
      url,
      method: "GET",
      authType: AuthType.POLIMI_EXAMS,
      ...options,
    })
    return mapAxiosRequest(request, response => response)
  },
  enrollExam(
    info: { c_insegn_piano: string; c_appello: number; aa_classe: string },
    options?: RequestOptions
  ) {
    const url = `/rest/v1/iscriz/${info.aa_classe}/${info.c_insegn_piano}/${info.c_appello}?lang=IT`
    const request = client.callPolimiExams<unknown>({
      url,
      method: "GET",
      authType: AuthType.POLIMI_EXAMS,
      ...options,
    })
    return mapAxiosRequest(request, response => response)
  },
  unenrollExam(c_iscrz: number, options?: RequestOptions) {
    const url = `/rest/v1/iscriz/${c_iscrz}`
    const request = client.callPolimiExams<unknown>({
      url,
      method: "DELETE",
      authType: AuthType.POLIMI_EXAMS,
      ...options,
    })
    return mapAxiosRequest(request, response => response)
  },
}
