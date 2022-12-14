---
id: "store"
title: 'Store'
sidebar_label: 'Store'
sidebar_position: 2
---

The STORE is the instance generated by a SETUP  
The STORE keeps the STATE of the FE stored   
The STATE can be changed and this results in an update of the REACT COMPONENTS involved.  
In practice the STATE is always synchronised with the VIEW  
with a SPECIFIC STATE you get one and only one SPECIFIC VIEW. 
  
The store presents itself in the form:

```ts
{
	state: object,
	[key: string]: (payload: any|null) => any|void
}
```

## state
It is in **read only**. 
Typically it contains all the data to compose the VIEW  
When a React component uses a STORE, the HOOK must be called:  
`useStore`

```js
import { useStore } from "@priolo/jon"
import MyStore from "/stores/my-store"

export function MyComponent() {
	const state = useStore(MyStore)
	return <div>{state.value}</div>
}
```

This way when the `state` is modified (by a `mutator`)  
the `MyComponent` will be re-rendered with the new `state`.

## getters/actions/mutator
All getters/actions/mutators in the SETUP  
when instantiated, are placed directly in the STORE. 

```js
const setup = {
	state: {
		value: ""
	},
	getters: {
		getValue: (_, {state}) => state.value,
	},
	actions: {
		addPre: ( pre, {state, ...store} ) => {
			store.setValue( `${pre} ${state.value}` )
		}
	},
	mutators: {
		setValue: value => ({value})
	}
}

const store = createStore(setup)

store.setValue("Pippo")
console.log( store.state.value )
// Pippo
store.addPre("Mr.")
console.log( store.state.value )
// Mr. Pippo

```