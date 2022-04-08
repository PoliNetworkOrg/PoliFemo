import { FC } from 'react';
import { Text } from 'react-native';


// I componenti sono delle funzioni, a cui viene passato come argomento un oggetto props
// https://it.reactjs.org/docs/components-and-props.html
// possono essere riutilizzati (tipo bottoni stilizzati) o possono rappresentare intere pagine
let Saluto: FC<{ nome: string }> = props => {
	if (props.nome.length == 0)
		return <Text>Nessuno da salutare...</Text>
    return <Text>Ciao {props.nome}</Text>
}

export default Saluto;