# PoliFemo

### Setup dell'ambiente

Prerequisiti:

- [NodeJS](http://nodejs.org/) versione LTS 18.x.x (che su linux/mac consiglio di installare
  tramite [nvm](https://github.com/nvm-sh/nvm))
- [pnpm](https://pnpm.io/) che una volta installato Node si può [generalmente installare](https://pnpm.io/installation#using-corepack) con

  ```sh
  corepack enable
  ```

- L'applicazione Expo GO installata sul proprio telefono (https://expo.dev/client)

Una volta clonata la repo la prima cosa da fare è installare le dependencies con

```sh
pnpm install
```

per la prima installazione delle dipendenze ci vorrà una vita perché le dev dependencies di react native sono più
pesanti di tua mamma, ma solo la prima volta

Poi c'è anche un bug in vscode alla prima installazione, che non riconosce i tipi di typescript, per
risolverlo basta ricaricarica la finestra di vscode (`ctrl` + `shift` + `p` -> `Reload Window`)

### Esecuzione

La prima volta bisogna fare il login

```sh
expo login
```

L'app può essere eseguita da linea di comando sul dispositivo con:

```sh
pnpm start
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

Molte risorse utili sono linkate nei commenti in [App.tsx](App.tsx)

In generale è sono scritte molto bene le documentazioni di

- [React](https://it.reactjs.org/docs/getting-started.html)
  per la sintassi e i paradigmi utilizzati per la UI
- [React Native](https://reactnative.dev/docs/getting-started)
  specificatamente su come funziona su mobile e
- [Expo](https://docs.expo.dev) per le molti moduli nativi
  (tipo fotocamera, gps, ecc.)
