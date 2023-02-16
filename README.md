# Polifemo

### Setup dell'ambiente

Prerequisiti:

- [NodeJS](http://nodejs.org/) versione lts 16.14.2 (che su linux/mac consiglio di installare
  tramite [nvm](https://github.com/nvm-sh/nvm))
- [Yarn](https://yarnpkg.com) che una volta installato Node si può installare con
  ```sh
  corepack enable
  ```
- La CLI Expo che si può installare con il comando
  ```sh
  npm install --global expo-cli
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

Consiglio di riferirsi alla sezione [Debug](#debug) per avviare il tutto da vscode, ma comunque
l'app può essere eseguita da linea di comando sul dispositivo con:

```sh
yarn start
```

e inquadrando il codice QR che viene sputato nella linea di comando, e il bundle javascript verrà
scaricato nell'app Expo Go, che supporta hot-reload e da cui si può aprire un element inspector e
avviare debugger scuotendo con molta rabbia e violenza il telefono

Più informazioni riguardo ai comandi nei docs della [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)

### Debug

Su VSCode serve aver installato l'estenzione [React Native Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native)
basta premere F5 e viene avviato il debugger, già configurato per avviare l'app con expo,
verrà aperta un pannello con il QR code da scannerizzare per aprire l'app su Expo GO.

Perché i breakpoint funzionino, bisogna attivare l'opzione "**Debug Remote JS**" nel menu di Expo
(che si può aprire agitando il telefono)

Se si tenta di avviare il debugger mentre questo non è stato correttamente fermato, potrebbe succedere
che vsc si incazzi dicendo cazzate tipo "An error occurred while attaching debugger to the application."

Per ovviare a questo lieve inconveniente basterà fermare lo "_Strumento di creazione pacchetti React Native_"
cliccando nella barra in basso sull'ononima voce, oppure usando il comando "_React Native: Stop Packager_"
dalla palette dei comandi di vsc (ctrl + shift + p)

### Contribuire

Per evitare di litigare, consiglio molto molto caldamente di utilizzare Prettier per formattare e
ESLint per il linting (per cui consiglio anche di installare le rispettive estensioni, che sono
nelle workspace recommendations)

per setuppare Prettier come formatter, innanzitutto [installare l'estenzione](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
(duh), poi consiglio di settarlo come predefinito nelle Impostazioni di VSC > Editor: Default Formatter

Poi impostarlo nel progetto aprendo la palette dei comandi (ctrl + shift + p) >
Format Document With... > Configure Default Formatter... > Prettier

Il progetto essere già configurato per l'utilizzo di [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
per evitare inconsistenze e per fare un po' di enforcing di best practices

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
