/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import { Teaching } from "api/collections/exams"
import { AdaptiveShadowView } from "components/BoxShadow"
import { PageWrap } from "components/PageLayout"
import { BodyText } from "components/Text"
import { MainStackScreen } from "navigation/NavigationTypes"
import { useState } from "react"
import { Pressable, ScrollView, View } from "react-native"
import { Icon } from "components/Icon"
import arrowRightSvg from "assets/exams/arrow_right.svg"
import { palette } from "utils/colors"
import {
  getExamStatus,
  getExamStatusDescription,
  monthsAcronymsIT,
} from "utils/exams"

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
          c_appello: 820906,
          d_app: "2024-01-10T15:00:00.000+0100",
          ora_ok: "S",
          t_appello: "U",
          d_apertura: "2023-11-27T00:00:00.000+0100",
          d_chiusura: "2024-01-05T00:00:00.000+0100",
          d_inizio_sessione: "2024-01-08T00:00:00.000+0100",
          d_fine_sessione: "2024-02-17T00:00:00.000+0100",
          domanda_valida: "N",
          c_domanda: 0,
          domanda_ateneo_valida: "N",
          c_domanda_ateneo: null,
          numIscrittiAppello: 207,
          risposteDomanda: null,
          risposteDomandaAteneo: null,
          descTipoAppello: "Ultima prova in itinere",
          xaula: "Cognomi da PJ a Summa in aula 2.0.1, da Sun a Z in T.1.3",
          xvisibil_appello_listainsegnamenti: true,
          hasIscrizioneConEsito: true,
          hasQuestionarioObblig: true,
          appelloConDomanda: false,
          iscrizioneAttiva: {
            c_iscriz: 9880997,
            c_risposta: null,
            c_risposta_ateneo: null,
            n_protocollo: 597835,
            show_prove_distanza: "N",
            verb_id_valutazione: 7079823,
            verb_esito: "29",
            verb_stato: "P",
            verb_positivo: "S",
            verb_esito_number: null,
            verb_data_fine_pubblicazione: "2024-02-02T13:00:00.000+0100",
            verb_messaggio:
              '<p>Gentile studente, <br /><br />Le comunico che ho pubblicato gli esiti relativi all\'insegnamento 085746 - Fondamenti di elettronica, A.A. 2023, Esame del 10/01/2024.<br /><br />La fase di pubblicazione si chiuder&agrave; in data 02/02/2024 13:00, dopodich&eacute; proceder&ograve; con il consolidamento degli esiti e la conseguente verbalizzazione. <br /><br />Pu&ograve; visualizzare i dati accedendo all\'applicazione "Consultazione esito esami" disponibile sul portale dei Servizi Online d\'Ateneo. <br /><br />Cordiali Saluti Prof. Bertulessi Luca<br /><br /><strong>Attenzione:</strong> messaggio automatico, non rispondere a questa mail.<br /><br />**** English ***** <br /><br />Dear student, <br /><br />I published the results concerning the course 085746 - Introduction to electronics, A.Y. 2023, Exam dated 10/01/2024.<br /><br />The publication time ends 02/02/2024 13:00, after which I will finalise and record the evaluation. Details are available on the University Online Services portal, by accessing "Consultation of exam results" application. <br /><br />Best Regards Prof. Bertulessi Luca<br /><br /><strong>Attention:</strong> automatic message, do not reply to this email.</p>',
            verb_mail_docente: "luca.bertulessi@polimi.it",
            verb_data_rifiuto: "2024-01-27T10:21:28.000+0100",
            verb_esito_rifiuto: "--",
            verb_msg_sospeso: null,
            verb_comunicazione_id: null,
            xrisposta_ateneo: null,
            hasCorrezioni: false,
            xverbEsito: "29",
            hasEsito: true,
            xverbStatoDesc: "PUBBLICATO",
            xrisposta: null,
            rifiutabile: true,
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
        {teachings?.map((teaching, i) =>
          teaching.appelliEsame.length === 0 ? null : (
            <View
              key={teaching.c_insegn_piano}
              style={{
                alignItems: "stretch",
                marginBottom: 16,
                marginHorizontal: 16,
                borderRadius: 16,
                backgroundColor: palette.lighter,
              }}
            >
              <AdaptiveShadowView
                style={{ marginBottom: 16 }}
                contentContainerStyle={{
                  backgroundColor: palette.primary,
                  height: 52,
                  flex: 1,
                  paddingVertical: 8,
                  flexDirection: "row",
                  alignItems: "center",
                  borderRadius: 16,
                }}
                shadow={{ offset: { y: 4 }, opacity: 0.25, blur: 4 }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 16,
                  }}
                >
                  <BodyText
                    style={{
                      fontWeight: "900",
                      color: "white",
                      fontSize: 16,
                      flex: 1,
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {teachings?.[i].xdescrizione}
                  </BodyText>
                  <Pressable
                    style={{
                      width: 40,
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Icon source={arrowRightSvg} scale={1.2} />
                  </Pressable>
                </View>
              </AdaptiveShadowView>
              {teachings?.[i].appelliEsame?.map(exam => {
                const dateExam = new Date(exam.d_app)

                const day = dateExam.getDate()

                const month = monthsAcronymsIT[dateExam.getMonth()]

                const year = dateExam.getFullYear()

                const status = getExamStatus(exam)
                return (
                  <View
                    key={exam.c_appello}
                    style={{
                      flex: 1,
                      flexDirection: exam.inAttesaDiEsito ? "row" : "column",
                      justifyContent: exam.inAttesaDiEsito
                        ? "space-between"
                        : undefined,
                      marginBottom: 16,
                      gap: 20,
                    }}
                  >
                    <View>
                      <BodyText
                        style={{
                          marginLeft: 16,
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: "300",
                        }}
                      >
                        <BodyText
                          style={{
                            fontWeight: "900",
                            color: "#fff",
                            fontSize: 14,
                          }}
                        >
                          {day}
                        </BodyText>{" "}
                        {month} {year}
                        {"-ESAME"}
                      </BodyText>
                    </View>

                    {exam.inAttesaDiEsito ? (
                      <BodyText
                        style={{
                          marginRight: 16,
                          color: status.isHighlighted ? palette.accent : "#fff",
                          fontSize: 12,
                          fontWeight: "900",
                        }}
                      >
                        {getExamStatusDescription(
                          status.type,
                          "it"
                        ).toUpperCase()}
                      </BodyText>
                    ) : (
                      <>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginRight: 16,
                          }}
                        >
                          <View
                            style={{
                              marginLeft: 16,
                              flex: 1,
                              flexDirection: "row",
                            }}
                          >
                            <BodyText
                              style={{
                                fontWeight: "900",
                                color: "#fff",
                                fontSize: 14,
                              }}
                            >
                              {"ESITO"}
                              {"  "}
                            </BodyText>

                            <View
                              style={{
                                backgroundColor: palette.accent,
                                borderRadius: 50,
                                padding: 5,
                                marginTop: -5,
                              }}
                            >
                              <BodyText
                                style={{
                                  color: "#000",
                                  fontSize: 14,
                                  fontWeight: "500",
                                }}
                              >
                                {exam.iscrizioneAttiva?.verb_esito === "RF"
                                  ? exam.iscrizioneAttiva?.verb_esito_rifiuto
                                  : exam.iscrizioneAttiva?.xverbEsito}
                              </BodyText>
                            </View>
                          </View>

                          <BodyText
                            style={{
                              marginLeft: 16,
                              color: "#fff",
                              fontSize: 14,
                              fontWeight: "300",
                            }}
                          >
                            <BodyText
                              style={{
                                fontWeight: "900",
                                color: "#fff",
                                fontSize: 14,
                              }}
                            >
                              {"STATUS: "}
                            </BodyText>{" "}
                            {exam.iscrizioneAttiva?.xverbStatoDesc}
                          </BodyText>
                        </View>
                        {exam.iscrizioneAttiva?.verb_esito === "RF" ? (
                          <View>
                            <BodyText
                              style={{
                                marginLeft: 16,
                                color: palette.accent,
                                fontSize: 12,
                                fontWeight: "500",
                              }}
                            >
                              {"RIFIUTATO IL " +
                                exam.iscrizioneAttiva.verb_data_rifiuto}
                            </BodyText>
                          </View>
                        ) : undefined}
                      </>
                    )}
                  </View>
                )
              })}
            </View>
          )
        )}
      </ScrollView>
    </PageWrap>
  )
}
