# Convenzioni

In questo file vengono descritte un paio di indicazioni generali da seguire nelle contribuzioni di
codice e qualche guida rapida al fine di aiutare a capire un po' di quirk qua e là

-   **[Naming conventions](#naming)**
-   **[Problemi comuni con il type system](#typing)**

## Naming

In generale si usa il `camelCase` per cose tipo

-   variabili locali
-   funzioni
-   prop dei componenti
-   metodi, attributi e proprietà
-   membri di oggetti e parametri delle funzioni

e il `PascalCase` per le

-   classi
-   componenti (anche se di fatto sono solo funzioni)
-   nomi di tipi e interfacce di typescript

ed se caso si può usare anche il `SCREAMING_SNAKE_CASE` per eventuali costanti.

### Esempi:

```ts
// una funzione pura è in camelCase, così come i suoi parametri
function helloWorld(name: string) {
    // variabili in generale sono sempre in camelCase
    const message = `Hello ${name}`
    console.log(message)
}
```

```tsx
// i componenti sono in PascalCase, ma i props sono in camelCase
function Button(props: { label: string; onClick?: () => void }) {
    // le variabili locali sono variabili locali normali, quindi in camelCase
    const [count, setCount] = useState(0)

    return (
        <Pressable onPress={() => props.onClick()}>
            <Text>{props.label}</Text>
        </Pressable>
    )
}
```

```ts
// i nomi delle interfacce anche sono in PascalCase (stesso vale per i tipi), e i membri sono in camelCase
type PageName = "home" | "settings"

interface Bar {
    foo: PageName
    bar: number
}

class FooBar extends Foo implements Bar {
    // ...

    // i nomi dei metodi sono comunque in pascalCase
    print() {
        console.log(this.foo)
        console.log(this.bar)
    }
}
```

```ts
// in caso di interfaccia con stesso nome di una classe, la convenzione è di mettere la lettera "I"
// davanti al nome dell'interfaccia
interface IFoo {
    // ...
}

class Foo implements IFoo {
    // ...
}
```

## Typing

Consiglio di fare riferimento al [TypeSript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

Se non siete familiare con typescript potreste trovarvi in difficoltà con il definire un paio di
tipi e essere tentati ad usare `any`.

Questa cosa va assolutamente evitata ad ogni costo perché è l'unico modo per far spuntare fuori bug
antipatici dove non si riesce a capire perché le cose non funzionano.

per tanto qua sotto porrò un paio di semplici esempi di cose non completamente intuitive per evitare
di ritrovarvi senza definizione di tipi

### Definizioni di funzioni:

```ts
// il tipo di una funzione generica può essere scritto nel modo più semplice con la sitassi dell'arrow function
let function: () => void // questa è una funzione senza parametri e senza valore restituito

// i parametri possono essere descritti scrivendone il nome e il tipo come normali variabili
let func: (a: number, b: string) => void

// il nome assegnato ad un parametro è completamente arbitrario e usato solo per documentare la funzione
// in realtà quando si assegna una funzione si può rinominare il parametro arbitrariamente
func = (x, y) => {
    // questa definizione è valida per la dichiarazione di tipi precedente
    // qui x sarà un numero e y una stringa
}

// allo stesso modo il return type non è strettamente vincolante quando è void, poiché javascript
// ignorerà qualsiasi valore restituito se non usato
func = (x, y) => {
    // questa definizione è comunque valida
    return "foo"
}
```

```tsx
// per quanto riguarda i tipi dei props, la dichiarazione del tipo di una funzione in questo modo è utile
// qua non ci interessa definire tipi di parametri o del valore restituito
let Button: FC<{
    label: string
    onClick?: () => void
}>

//...

let Component: FC = () => (
    <Button
        label="ciao"
        onClick={click => {
            // click qui sarà di tipo any e typescipt darà errore ❌
            return "ciao" // dato che il tipo restituito da onClick è void, return verrà ignorato in qualsiasi caso
        }}
    />
)
```

```tsx
// se si vuole fare in modo che venga passato qualcosa alla funzione, si può definire il tipo del parametro
let Button: FC<{
    label: string
    onClick?: (e: React.MouseEvent) => void
}>

//...

let Component: FC = () => (
    <Button
        label="ciao"
        onClick={click => {
            // Qui click sarà definito e di tipo React.MouseEvent, anche se nella dichiarazione
            // di Button sopra è stato chiamato "e"
        }}
    />
)
```

### Definizioni di componenti:

```tsx
// se si vuole passare qualche componente come prop, ci sono un paio di tipi che ci vengono in aiuto

// un FunctionComponent (FC) ha come tipo di restituzione React.ReactElement, che è un tipo generico
// per i componenti a cui possono essere passati props (di cui a loro volta si può definire il tipo)
let Button: FC<{
    label: string
    icon: React.ReactElement<IconProps, any>
}>

// per componenti generici i cui props non sono importanti, si può usare JSX.Element, che è ugaule a
// React.ReactElement<any, any>

let Button: FC<{
    label: string
    icon: JSX.Element // più compatto ed inclusivo
}>

// ReactNode accetta tutto quello che è considerato un valido nodo di React, quindi componenti ma anche
// array di componenti, o stringhe (che in react native sono validi nodi solo per <Text>)
// può essere utilizzato in caso serva più flessibilità, ma in generale è meglio JSX.Element
let Button: FC<{
    label: string
    node: React.ReactNode // questo accetta un po' qualsiasi cosa come nodo
}>
```

### Altre definizioni con Unknown:

```ts
// in caso si voglia definire qualche sorta di funzione che potrebbe potenzialmente accettare
// qualsiasi tipo di parametro, è preferibile usare unknown al posto di any

function log(x: any) {
    // ❌ qui x sarà any, quindi qualsiasi parametro è accessibile anche se non esiste
    console.log(x)
    console.log(x.foo) // ⚠️ possibile errore di runtime
}

function log(x: unknown) {
    // ✅ qui x sarà unknown, per accedere a parametri è necessario usare un type guard
    console.log(x)
    console.log(x.foo) // ⚠️ errore di compilazione, meglio
}
```
