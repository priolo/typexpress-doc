---
id: "glossary"
title: 'Glossary'
sidebar_label: 'Glossary'
sidebar_position: 3
---

TREE
Indica un insieme di NODE tutti collegati ad un unico NODE-ROOT

NODE
è l'elemento atomico di Bob di per se stabilisce solo la struttura del TREE
ma puo' essere derivato per assumere anche il ruolo di SERVICE.
Ha un `name` identificativo, un `parent` e altri NODEs `children`
Implementa `INode` 

STATE
è sostanzialmente uno oggetto JSON 