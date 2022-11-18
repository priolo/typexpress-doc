Let's consider a simple ToDo  
This is what your colleague left you as a gift 💩 before going on holiday:  

[codesandbox](https://codesandbox.io/s/to-do-vanilla-wgdgfg?file=/src/index.js)

In `index.js` c'è un groviglio di funzioni all'interno dei componenti passate tra i componenti che chiamano altre funzioni  
E se fosse un progetto reale sarebbe MOLTO MOLTO MOLTO PEGGIO  
perche' l'albero dei componenti è piu' profondo  
e la nidificazione dei componenti moltiplica la complessità!  


### Creiamo uno STORE
Proviamo a estrapolare la LOGICA e lo STATO dai COMPONENTI.

```js
const myStore = {
	
	callbacks: new Set(),
	subscribe: (callback) => {
		myStore.callbacks.add(callback)
		return () => myStore.callbacks.delete(callback)
	},
	getSnapshot: () => myStore.state,
	changeState: (newState) => {
		myStore.state = newState
		myStore.callbacks.forEach( cb => cb() )
	},

}
```
[CODE](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/store.js:23-336)

Abbiamo implementato le funzioni COMUNI a tutti gli STORE   
usate da [`useSyncExternalStore`](https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore) il nuovo hook di React18 (ma si puo' fare anche con React17!)  
cioe':   
- `subscribe`  
Memorizza un callback da chiamare quando lo STATE dello STORE è cambiato  
- `getSnapshot`  
Restituisce lo STATE corrente  
- `changeState`  
E' comodo per cambiare sostituire uno STATE con un altro STATE.   
Ricordiamoci che uno STATE è immutabile!  
E notificare la modifica a tutti i `callback` registrati 

### Inseriamo lo STATE

```js
const myStore = {
	...
	state: {
		todos: [
			{ desc : "init value" },
		],
		todoInEdit: {
			desc: ""
		},
	},
	...
}
```
[CODE](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/store.js:339-460)

E' la fotografia di come deve apparire la VIEW
Uno STATE rappresenta una e una sola visualizzazione della VIEW

### Inseriamo i MUTATORS

```js
const myStore = {
	...
	setTodos: todos => myStore.changeState({
		...myStore.state,
		todos
	}),
	setTodoInEditProp: prop => myStore.changeState({
		...myStore.state,
		todoInEdit: { ...myStore.state.todoInEdit, ...prop }
	}),
	...
}
```
[CODE](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/store.js:339-460)

Semplicemente eseguono il `changeState` passandogli lo STATE modificato
Di conseguenza notificheranno le modifiche ai COMPONENTI come detto prima

### Aggiungiamo le ACTIONS

```js
const myStore = {
	...
	deleteTodo: (index) => {
		const newTodos = myStore.state.todos.filter ((_,i)=>i!==index)
		myStore.setTodos(newTodos)
	},
	addTodoInEdit: () => {
		const newTodos = [...myStore.state.todos, myStore.state.todoInEdit]
		myStore.setTodos(newTodos)
		myStore.setTodoInEditProp({desc: ""}) 
	},
	...
}
```
[CODE](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/store.js:483-773)



### Aggiorniamo la VIEW

```jsx
function App() {
	return (<div>
		<List />
		<Form />
	</div>);
}

function List() {
	const state = useSyncExternalStore(store.subscribe, store.getSnapshot)

	return (
		<ul>
			{state.todos.map((td, index) => (<li>
				{td.desc}
				<button onClick={_=>store.deleteTodo(index)}>
					Delete
				</button>
			</li>))}
		</ul>
	)
}

function Form() {
	const state = useSyncExternalStore(store.subscribe, store.getSnapshot)
	const handleChange = e => store.setTodoInEditProp({desc:e.target.value})
	const handleClickAdd = _ => store.addTodoInEdit()

	return (<div>
		<input
			value={state.todoInEdit.desc}
			onChange={handleChange}
		/>
		<button onClick={handleClickAdd}>Add</button>
	</div>)
}
```
[CODE](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/index.js:130-828)

Lo STORE ha il compito di mantenere lo STATE e la LOGICA  
E i COMPONENT sono molto piu' leggibili  

Inoltre possiamo spostare, per esempio, `List` in un altro componente senza cambiare nulla  
perche' non è piu' "dipendente" dal suo PARENT  
   
Infatti `List` non ha nessuna proprietà  
questo facilita anche gli unit-test.  
Insomma cambia TUTTO!


## Jon

Ci sono molte librerie in React (come al solito) che permettono la gestione dello STATE.  
Io naturalmente ne ho fatta una 😃  
Secondo me, rispetto alle altre, permette
1) di vedere perfettamente come lavora sotto il cofano. NO MAGIA
2) è superleggera
3) fa solo questo e inent'altro

Se vuoi dagli un occhio qui


