/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Teaching } from "api/collections/exams"
import { PageWrap } from "components/PageLayout"
import { MainStackScreen } from "navigation/NavigationTypes"
import { useState } from "react"
import { ScrollView } from "react-native"
import { ExamResultsSection } from "components/Exams/Results/ExamResultsSection"

export const Results: MainStackScreen<"Results"> = () => {
  const [teachings, setTeachings] = useState<Teaching[] | undefined>([
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
          c_appello: 820919,
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
  ])

  return (
    <PageWrap title={"Esiti"}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        bounces={false}
      >
        {teachings?.map(teaching =>
          teaching.appelliEsame.map((result, j) => (
            <ExamResultsSection
              key={`${teaching.c_insegn_piano}_${j}`}
              resultExam={{
                teachingName: teaching.xdescrizione,
                teachingCode: teaching.c_classe_m,
                teacher: teaching.docente_esame,
                currentYear: teaching.aa_classe,
                academicYear: teaching.ac_freq,
                semester: teaching.semestre_freq,
                result: result,
              }}
            />
          ))
        )}
      </ScrollView>
    </PageWrap>
  )
}
