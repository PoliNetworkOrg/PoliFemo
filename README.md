# Polifemo

### Setup dell'ambiente
per usare 
- [NodeJS](http://nodejs.org/) versione lts 16.14.2 (che su linux/mac consiglio di installare 
tramite [nvm](https://github.com/nvm-sh/nvm))
- [Yarn](https://yarnpkg.com) (che con Node 16.10+ si può attivare con il comando ```corepack enable```)
- La CLI Expo che si può installare con il comando 
    ```sh
    npm install --global expo-cli
    ```
- L'applicazione Expo GO installata sul proprio telefono (https://expo.dev/client)

### Esecuzione
Una volta clonata la repo la prima cosa da fare è installare le dependencies con
```sh
yarn
```
che a sua volta si installa con 
```sh
npm install --global yarn
```
per la prima installazione delle dipendenze ci vorrà una vita perché le dev dependencies di react native sono più
pesanti di tua mamma, ma solo la prima volta

Poi c'è anche un bug in vscode alla prima installazione, a quanto pare bisogna chiudere e riaprire 
la finestra perché non si rende conto che le dependencies sono state installate

L'app può essere eseguita sul dispositivo con il comando
```sh
yarn start
```
e inquadrando il codice QR che viene sputato nella linea di comando, e il bundle javascript verrà
scaricato nell'app Expo Go, che supporta hot-reload e da cui si può aprire un element inspector e
avviare debugger scuotendo con molta rabbia e violenza il telefono

Più informazioni riguardo ai comandi nei docs della [Expo CLI](https://docs.expo.dev/workflow/expo-cli/)

### debug
va ancora impostato, comunque serve st'estenzione [React Native Tools](https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native)
(che è nelle raccomandazioni)

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
