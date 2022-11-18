---
slug: usesyncexternalstore
title: "A good reason to use React18: useSyncExternalStore"
authors:
  name: Priolo
  title: Jon maintainer
  url: https://github.com/priolo
  image_url: https://github.com/priolo.png
tags: [React18, hook, useSyncExternalStore]
---

Let's consider a simple ToDo  
This is what your colleague left you as a gift 💩 before going on holiday:  

[codesandbox](https://codesandbox.io/s/to-do-vanilla-wgdgfg?file=/src/index.js)

In `index.js` there is a mess of functions within components passed between components that call other functions.  
And if it were a real project it would be MUCH MUCH worse  
because the COMPONENT TREE is **deeper**  
and the nesting of COMPONENTs multiplies the complexity! 


### Let's create a STORE
Let us try to extrapolate the LOGIC and STATUS from the COMPONENTs  
to put it into a STORE.

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
[codesandbox](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/store.js:23-336)

It is a generic implementation of a STORE using [useSyncExternalStore](https://reactjs.org/docs/hooks-reference.html#usesyncexternalstore) 
the new React18 hook (but it can also be done with React17!).
therefore:   
- `subscribe`  
Stores a callback to be called when the STATE of the STORE is changed  
- `getSnapshot`  
Returns the current STATE   
- `changeState`  
It is convenient to exchange one STATE for another STATE.   
Remember that a STATE is immutable!  
And notify all registered `callbacks` of the change 


### Enter the STATE

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
[codesandbox](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/store.js:339-460)

It is a picture of what our VIEW, in this case the ToDo app, should look like.  
A STATE represents one and only one view of the VIEW.  

### Enter the MUTATORS

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
[codesandbox](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/store.js:339-460)

They simply execute the `changeState` by passing it the modified STATE.  
Consequently, they will notify the changes to the COMPONENTS.  
(as said before)


### Let's add the ACTIONS

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
[codesandbox](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/store.js:483-773)


### Let's update the VIEW

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
[codesandbox](https://codesandbox.io/s/to-do-usesyncexternalstore-brcpe3?file=/src/index.js:130-828)

The STORE is responsible for managing the LOGIC and the STATE  
the VIEW simply synchronises with the STORE  

The COMPONENTS are more readable

and can be moved without problems.
For example, `List` can be put inside another component without changing anything  
because it is no longer "dependent" on its PARENT  
In fact `List` has no properties  

this also makes unit-testing easier.  

In short, if I have to change the behavior I have to look at the STOREs.  
If I have to change the display I will have to act on the COMPONENTS   


## Jon

There are many libraries in React (as usual) that allow STATE management.  
Of course I made one 😃  
In my opinion, compared to the others, it allows  
1) to see perfectly how it works under the hood. NO MAGIC  
2) is super light  
3) does only this, and nothing else  
  
If you want, check it out [here](https://priolo.github.io/jon-doc/)
