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
import { getExamStatus, monthsAcronymsIT } from "utils/exams"

export const Results: MainStackScreen<"Results"> = () => {
  const [teachings, setTeachings] = useState<Teaching[] | undefined>([
    {
      c_classe_m: 101,
      ac_freq: 2,
      semestre_freq: "Fall",
      c_insegn_piano: "XYZ456",
      docente_esame: "Prof. Johnson",
      docente_esame_mail: "prof.johnson@example.com",
      aa_freq: "2023-2024",
      aa_classe: "Mathematics",
      posins: "Second",
      warning_esame: "Bring a calculator",
      appelliEsame: [
        {
          c_appello: 1,
          d_app: "2024-02-02",
          ora_ok: "09:00 AM",
          t_appello: "In-person",
          d_apertura: "2024-10-01",
          d_chiusura: "2024-10-15",
          d_inizio_sessione: "2024-10-20",
          d_fine_sessione: "2024-10-25",
          domanda_valida: "Yes",
          c_domanda: 101,
          domanda_ateneo_valida: "Yes",
          c_domanda_ateneo: null,
          numIscrittiAppello: 50,
          risposteDomanda: {}, // Replace with actual data structure
          risposteDomandaAteneo: {}, // Replace with actual data structure
          descTipoAppello: "Written",
          xaula: "A101",
          xvisibil_appello_listainsegnamenti: true,
          hasIscrizioneConEsito: true,
          hasQuestionarioObblig: false,
          appelloConDomanda: true,
          iscrizioneAttiva: {
            c_iscriz: 201,
            c_risposta: {}, // Replace with actual data structure
            c_risposta_ateneo: {}, // Replace with actual data structure
            n_protocollo: 2022101,
            show_prove_distanza: "No",
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
            verb_comunicazione_id: {}, // Replace with actual data structure
            xrisposta_ateneo: {}, // Replace with actual data structure
            hasCorrezioni: false,
            xverbEsito: null,
            hasEsito: false,
            xverbStatoDesc: null,
            xrisposta: {}, // Replace with actual data structure
            rifiutabile: true,
          },
          oggiBeforeAppello: false,
          iscrizioniAperteConRiserva: true,
          hasIscrizioniAttive: true,
          appelloConDomandaAteneo: false,
          prenotazioneAppelloStraordinario: false,
          appelloStraordinario: false,
          xh_appello: "Morning",
          xdomanda: "Multiple-choice questions",
          xdomanda_ateneo: {}, // Replace with actual data structure
          inAttesaDiEsito: true,
          xnoteAppello: ["Bring a valid ID", "No electronic devices allowed"],
          iscrizioniAperte: true,
        },
      ],
      xdescrizione: "Advanced Calculus",
    },
    {
      c_classe_m: 101,
      ac_freq: 2,
      semestre_freq: "Fall",
      c_insegn_piano: "XYZ456",
      docente_esame: "Prof. Johnson",
      docente_esame_mail: "prof.johnson@example.com",
      aa_freq: "2023-2024",
      aa_classe: "Mathematics",
      posins: "Second",
      warning_esame: "Bring a calculator",
      appelliEsame: [
        {
          c_appello: 1,
          d_app: "2024-02-02",
          ora_ok: "09:00 AM",
          t_appello: "In-person",
          d_apertura: "2024-10-01",
          d_chiusura: "2024-10-15",
          d_inizio_sessione: "2024-10-20",
          d_fine_sessione: "2024-10-25",
          domanda_valida: "Yes",
          c_domanda: 101,
          domanda_ateneo_valida: "Yes",
          c_domanda_ateneo: null,
          numIscrittiAppello: 50,
          risposteDomanda: {}, // Replace with actual data structure
          risposteDomandaAteneo: {}, // Replace with actual data structure
          descTipoAppello: "Written",
          xaula: "A101",
          xvisibil_appello_listainsegnamenti: true,
          hasIscrizioneConEsito: true,
          hasQuestionarioObblig: false,
          appelloConDomanda: true,
          iscrizioneAttiva: {
            c_iscriz: 201,
            c_risposta: {}, // Replace with actual data structure
            c_risposta_ateneo: {}, // Replace with actual data structure
            n_protocollo: 2022101,
            show_prove_distanza: "No",
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
            verb_comunicazione_id: {}, // Replace with actual data structure
            xrisposta_ateneo: {}, // Replace with actual data structure
            hasCorrezioni: false,
            xverbEsito: null,
            hasEsito: false,
            xverbStatoDesc: null,
            xrisposta: {}, // Replace with actual data structure
            rifiutabile: true,
          },
          oggiBeforeAppello: false,
          iscrizioniAperteConRiserva: true,
          hasIscrizioniAttive: true,
          appelloConDomandaAteneo: false,
          prenotazioneAppelloStraordinario: false,
          appelloStraordinario: false,
          xh_appello: "Morning",
          xdomanda: "Multiple-choice questions",
          xdomanda_ateneo: {}, // Replace with actual data structure
          inAttesaDiEsito: false,
          xnoteAppello: ["Bring a valid ID", "No electronic devices allowed"],
          iscrizioniAperte: true,
        },
      ],
      xdescrizione: "Advanced Calculus",
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
                        {status.desc.toUpperCase()}
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
                                24
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
                            {"Pubblicato"}
                          </BodyText>
                        </View>
                        <View>
                          <BodyText
                            style={{
                              marginLeft: 16,
                              color: palette.accent,
                              fontSize: 12,
                              fontWeight: "500",
                            }}
                          >
                            {"RIFIUTATO IL 24 GEN 2024"}
                          </BodyText>
                        </View>
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
