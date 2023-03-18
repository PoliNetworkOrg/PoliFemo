# Polifemo

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-16-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

### Setup dell'ambiente

Prerequisiti:

- [NodeJS](http://nodejs.org/) versione lts 18.15.0 (che su linux/mac consiglio di installare
  tramite [nvm](https://github.com/nvm-sh/nvm))
- [Yarn](https://yarnpkg.com) che una volta installato Node si può installare con
  ```sh
  corepack enable
  ```
- L'applicazione Expo GO installata sul proprio telefono (https://expo.dev/client)

Una volta clonata la repo la prima cosa da fare è installare le dependencies con

```sh
yarn
```

per la prima installazione delle dipendenze ci vorrà una vita perché le dev dependencies di react native sono più
pesanti di tua mamma, ma solo la prima volta

Poi c'è anche un bug in vscode alla prima installazione, a quanto pare bisogna chiudere e riaprire
la finestra perché non si rende conto che le dependencies sono state installate

### Esecuzione

La prima volta bisogna fare il login

```sh
expo login
```

L'app può essere eseguita da linea di comando sul dispositivo con:

```sh
yarn start
```

e inquadrando il codice QR che viene sputato nella linea di comando, e il bundle javascript verrà
scaricato nell'app Expo Go, che supporta hot-reload e da cui si può aprire un element inspector e
avviare debugger scuotendo con molta rabbia e violenza il telefono

### Reporting Bugs/Feature Requests:

#### To report bugs or feature requests, follow these guidelines:

- Open Github.com in your web browser
- Search for the PoliFemo repository
- Go to the "Issues" section
- Click "New Issue"

#### To report a bug, use the following guidelines:

- Title: [BUG] Brief description of the issue
- Label: "type: bug"
- Description: Describe the issue in detail, including steps to reproduce it and any error messages you encountered. Include a screenshot or video if possible.

#### To request a new feature, use the following guidelines:

- Title: [FEATURE] Brief description of the feature
- Label: "type: suggestion"
- Description: Describe the feature in detail, including how it would benefit users and any potential challenges or limitations.

### Risorse

Consigliato dare un'occhiata alla [demo di autenticazione con expo](https://github.com/toto04/poliauth-expo-demo)
per vedere come può essere strutturata un'app

Molte risorse utili sono linkate nei commenti in [App.tsx](App.tsx)

In generale è sono scritte molto bene le documentazioni di

- [React](https://it.reactjs.org/docs/getting-started.html)
  per la sintassi e i paradigmi utilizzati per la UI
- [React Native](https://reactnative.dev/docs/getting-started)
  specificatamente su come funziona su mobile e
- [Expo](https://docs.expo.dev) per le molti moduli nativi
  (tipo fotocamera, gps, ecc.)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Tammura"><img src="https://avatars.githubusercontent.com/u/72708024?v=4?s=100" width="100px;" alt="Ahmed"/><br /><sub><b>Ahmed</b></sub></a><br /><a href="#projectManagement-Tammura" title="Project Management">📆</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/toto04"><img src="https://avatars.githubusercontent.com/u/34661230?v=4?s=100" width="100px;" alt="Tommaso Morganti"/><br /><sub><b>Tommaso Morganti</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=toto04" title="Code">💻</a> <a href="#maintenance-toto04" title="Maintenance">🚧</a> <a href="#mentoring-toto04" title="Mentoring">🧑‍🏫</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/SugoGangotti"><img src="https://avatars.githubusercontent.com/u/101225498?v=4?s=100" width="100px;" alt="SugoGangotti"/><br /><sub><b>SugoGangotti</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=SugoGangotti" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/DiegoZaff"><img src="https://avatars.githubusercontent.com/u/43524162?v=4?s=100" width="100px;" alt="Diego"/><br /><sub><b>Diego</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=DiegoZaff" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bob27aggiustatutto"><img src="https://avatars.githubusercontent.com/u/120955097?v=4?s=100" width="100px;" alt="bob27aggiustatutto"/><br /><sub><b>bob27aggiustatutto</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=bob27aggiustatutto" title="Code">💻</a> <a href="#maintenance-bob27aggiustatutto" title="Maintenance">🚧</a> <a href="#mentoring-bob27aggiustatutto" title="Mentoring">🧑‍🏫</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/lups2000"><img src="https://avatars.githubusercontent.com/u/100372313?v=4?s=100" width="100px;" alt="Matteo Luppi"/><br /><sub><b>Matteo Luppi</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=lups2000" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.linkedin.com/in/cosimogiovanninegri"><img src="https://avatars.githubusercontent.com/u/93294521?v=4?s=100" width="100px;" alt="Cosimo Giovanni Negri"/><br /><sub><b>Cosimo Giovanni Negri</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=cosimonegri" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/EndBug"><img src="https://avatars.githubusercontent.com/u/26386270?v=4?s=100" width="100px;" alt="Federico Grandi"/><br /><sub><b>Federico Grandi</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=EndBug" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/pontig"><img src="https://avatars.githubusercontent.com/u/59708804?v=4?s=100" width="100px;" alt="pontig"/><br /><sub><b>pontig</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=pontig" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AndreaTorti-01"><img src="https://avatars.githubusercontent.com/u/74457299?v=4?s=100" width="100px;" alt="Andrea Torti"/><br /><sub><b>Andrea Torti</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=AndreaTorti-01" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/francescolf"><img src="https://avatars.githubusercontent.com/u/14892143?v=4?s=100" width="100px;" alt="Francesco Lo Faro"/><br /><sub><b>Francesco Lo Faro</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=francescolf" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Elylo15"><img src="https://avatars.githubusercontent.com/u/58746092?v=4?s=100" width="100px;" alt="Elylo"/><br /><sub><b>Elylo</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=Elylo15" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Eliaxie"><img src="https://avatars.githubusercontent.com/u/27226791?v=4?s=100" width="100px;" alt="Eliaxie"/><br /><sub><b>Eliaxie</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=Eliaxie" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/stignarnia"><img src="https://avatars.githubusercontent.com/u/80171209?v=4?s=100" width="100px;" alt="stignarnia"/><br /><sub><b>stignarnia</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=stignarnia" title="Code">💻</a></td>
    </tr>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/frabazz"><img src="https://avatars.githubusercontent.com/u/35663791?v=4?s=100" width="100px;" alt="Francesco Bazzano"/><br /><sub><b>Francesco Bazzano</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=frabazz" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Bull0"><img src="https://avatars.githubusercontent.com/u/27016169?v=4?s=100" width="100px;" alt="Federico Bulloni"/><br /><sub><b>Federico Bulloni</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=Bull0" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
