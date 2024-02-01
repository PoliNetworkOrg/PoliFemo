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
  iscrizioneAttiva: {
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

interface TeachingResponseData {
  MESSAGES: unknown[] // ?
  INSEGN: Teaching[]
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
}
