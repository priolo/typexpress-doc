---
id: ""
title: ''
sidebar_label: ''
sidebar_position: 100
---

CE l'HO FATTA!
è incredibile quanto ho dovuto penare per fare sta roba!!!  
ok allora dalla documentazione di google sembrerebbe che per fare un servizio "server -> server"  
bisogna utilizzare gli "account di servizio"

https://cloud.google.com/iam/docs/understanding-service-accounts

automatizzano delle cose e anche la creazione dei documenti in GoogleDrive  
Infatti ne ho creato uno .. che mi da il JWT  
Anche il JWT sembrerebbe essere la maniera "naturale" per fare questo:  
![image](/uploads/281f14fef0a8b13cc8e731b9138fc194/image.png)  
  
in pratica per fare na roba del genere crei un "account di servizio" e gli dai dei permessi   
questo perche' non vuoi mettere direttamente il tuo account dentro l'applicazione NodeJs   
metti che domani vuoi cmabiare i permessi alla nostra app basta che agisci su questo "account di servizio"  

allora sta roba pero' è un casino, cioe' la documentazione di google non ti aiuta manco per il cazzo

Cmq i passi sono questi:

1) Abilitare le API per i SpreadSheets e GoogleDrive  
![image](/uploads/09ab23dbc133c1f023e4903c08145319/image.png)  

2) In "Credenziali" (in italiano purtroppo ce l'ho io!) crea sto "Account di servizio"
![image](/uploads/c80f831d6d5638086d60d240217679d6/image.png)  

3) Ci dai un nome qualsivoglia e ricavi quindi l'email "fittizia" di questo account di servizio
![image](/uploads/7b0e2a00a1edde70fe4e952120cc2745/image.png)

4) Crealo e continua quindi assegnando un ruolo. Da EDITOR dovrebbe essere sufficiente
![image](/uploads/46e0226b778bef0c773f65b660c427f5/image.png)  

5) fai FINE ... dovrebbe essere sufficiente  

6) Quindi vai nella tua bella lista di "account di servizio" e cliccaci sopra  
![image](/uploads/80f214a5d7b1627d032750bb8d798a4f/image.png)  

7) in questo pannello crea una nuova chiave (JWT) delle credenziali del tuo account di servizio  
![image](/uploads/953f3c2220f488a22e791f9ac8a2184a/image.png)  
Quindi otterrai un file .json che puoi subito rinominare come:  
`credentials.json`  
e mettere nella root del progetto  

8) Ora nel tuo GoogleDrive o quello del cliente o di chi vuoi tu anche il mio se vogliamo  
puoi creare la cartella e condividerla con sto "account di servizio" come se fosse un qualsiasi altro utente   
La figata è che semplicemente la condividi e quando vuoi gli togli la condivisione.  
Comunque il resto del tuo GoogleDrive non è "coinvolto" ma solo quella cartella.   
![image](/uploads/a29420f6ea10c5234326756b1cfef7dc/image.png)    
![image](/uploads/7899b7347d948989a8289bda66c076e3/image.png)  

9) ultimo passo è che devi indicare a NodeJs dove andare a mettere i SpreadSheets creati .. cioe' dentro la cartella condivisa che abbiamo appena fatto. Questa ha un id nell'url.. quindi copi l'id...  
![image](/uploads/fe19d511248505c9f79787940fd64783/image.png)  
... e lo shiaffi in `.env`  
![image](/uploads/3beceaffed3b7aa1c4638a36abccaf06/image.png)   

a questo punto dovrebbe andare ... ma chissa' he!  
pero' senti è questa la procedura da fare a come ho capito io... m'ha inculato tipo un giorno e mezzo!!!