# Polifemo

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-2-orange.svg?style=flat-square)](#contributors-)
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
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/toto04"><img src="https://avatars.githubusercontent.com/u/34661230?v=4?s=100" width="100px;" alt="Tommaso Morganti"/><br /><sub><b>Tommaso Morganti</b></sub></a><br /><a href="https://github.com/PoliNetwork APS/PoliFemo/commits?author=toto04" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
