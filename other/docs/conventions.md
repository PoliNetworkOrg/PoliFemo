# Convenzioni

In questo file vengono descritte un paio di indicazioni generali da seguire nelle contribuzioni di
codice

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
