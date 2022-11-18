---
title: 'Why'
sidebar_label: 'Why'
sidebar_position: 2
---

## Perche'

Inizialmente dovevo creare un semplice microservizio in Express  
Durante lo sviluppo mi sono reso conto che per ogni opzione aggiunta (JWT, DB, Render engine...)  
dovevo studiare diversi approcci.  
Ho pensato che sarebbe bello nascondere la complessità utilizzando un astruttura ad albero.  

## Concetti base

L'unico concetto da imparare è come utilizzare questo albero di servizi  
in realta' non serve altro!   
Cioe', è chiaro che bisogna conoscere il servizio,  
ma il modo in cui si recupera, usa o modifica è comune per tutti i NODEs da cui i SERVICEs derivano.  

## NODE

Un TREE è semplicemente composta da NODEs  
Il NODE ha delle caratteristiche:
- una stringa `name` che li identifica
- un'altro NODE `parent` (se c'e') che contiene il NODE stesso
- un array di NODEs `children` contenuti da questo NODE

Implementando l'interfaccia `INode`
si possono utilizzare gli strumenti per gestire i NODEs

Per esempio:

Se volessi creare un NODE con nome "root" senza nessun figlio
una cosa semplice semplice
```js
const root = new Node("root")
```

Oppure creare un NODE e poi inserirci dentro altri NODEs come "children"
```js
const root = new Node("root")
// creo il NODE "child1"
const child1 = new Node("child1")
// inserisco in "child1" il NODE "child1.1"
child1.addChild(new Node("child1.1"))
// inserisco in "child1" il NODE "child1.2"
child1.addChild(new Node("child1.2"))
// in fine "child1" nel NODE-ROOT
root.addChild(child1)
root.addChild(new Node("child2"))
```

Chiaramente un NODE inserito si puo' anche togliere
```js
const root = new Node("root")
const child1 = new Node("child1")
root.addChild(child1)
root.addChild(new Node("child2"))
root.addChild(new Node("child3"))
root.removeChild(1) // child2
root.removeChild(child1)
```

## NODE STATE

I `NodeState` sono dei NODEs con uno STATE interno  
che puo' essere modificato da `setState`.  
> NOTA: Non possiamo creare direttamente NodeState perche' è "abstract"    
in realta' noi non utilizzeremo mai direttamente `NodeState`.  

```js
// estendo e instanzio NodeState
const node = new class extends NodeState {
	protected _state = {
		value1: "init value1",
		value2: "init value2"
	}
}
expect(node.state).toMatchObject({
	value1: "init value1",
	value2: "init value2"
})

// NOTA: modifico solo la proprietà "value2" del suo STATE
node.setState( { value2: "modify value2"} )
expect(node.state).toMatchObject({
	value1: "init value1",
	value2: "modify value2"
})
```

Inoltre posso definire un set (`dispatchMap`) di `dispatcher`  
Questi `dispatcher` solitamente sono funzioni pure e applicano delle modifiche allo `state`  

```js
// estendo e instanzio NodeState
const node = new class extends NodeState {
	get dispatchMap(): any {
		return {
			// questa riga serve se si vogliono ereditare i "dispatcher" 
			// (in questo caso non eredita nulla da `NodeState`)
			...super.dispatchMap,
			// questa è semplicemente una funzione che setta un valore al NODE
			set_state1: (state, payload: any) => {
				this.setState(payload)
				return "ok-1"
			},
			// i `dispatcher` possono essere anche asincroni
			set_state2: async (state, payload: any) => {
				await time.delay(10)
				this.setState(payload)
				return "ok-2"
			}
		}
	}
}

// chiamo il `dispatch` con nome `set_state1` e gli passo un `payload`
let ret = await node.dispatch({
	type: "set_state1",
	payload: { val: 1 }
})
expect(ret).toEqual("ok-1")

// chiamo il dispatch asincrono
ret = await node.dispatch({
	type: "set_state2",
	payload: { val2: 2 }
})
expect(ret).toEqual("ok-2")

// a questo punto lo `state` dovrebbe essere cambiato
expect(node.state).toEqual({ val: 1, val2: 2 })
```

