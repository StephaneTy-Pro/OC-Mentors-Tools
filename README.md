# Préambule

Github réagissant très mal à ma configuration exotique, je ne peux pas garantir que les fichiers github seront àn jour.
Je vais créer un autre dépôt sur codeberg

# Comment ça fonctionne

## Installation de l'extension

Cf installation d'une extension en mode dev
Pour firefox dans l'url saisissez about:debugging et séléctionnez l'archive que vous venez de télécharger

## Remarques

Il est possible de voir apparaitre des messages d'erreur dans la console
 - ceux qui vous disent que la constante est déjà définie : c'est normal et c'est du à la double injection (au chargement de l'addon, et au chargement de la page) ; ça n'apparait qu'après chargement de l'addon
 - ceux qui vous disent attention je n'ai pas sur télécharger le script xxx de l'extension, utilisation de l'url de fallback. C'est normal car dans cette version (debug) j'utilise (mais vous pouvez le faire aussi en definissant un serveur local) la possibilité d'utiliser un script local plutôt que celui integré dans le plugin pour debugger par exemple.

## Utilisation

Préalable: Notez que tout se passe dans la console il est possible que par la suite on puisse intéragir avec une ui

Fonctions existantes pour le moment dans l'ensemble APIOC

- getUser
- getUserAvailabilities
- getUserEvents
- getUserExpectedBenefits
- getUserFollowedPath
- getUserLinks
- getUserPaths
- getUserPathProjects
- getUserStudents
- getMentor
- getHistorySessions
- getHistorySessionsAfter
- getHistorySessionsBefore
- getHistorySessionsBetween
- getPendingSessionsAfter
- getPendingSessionsBefore
- getProjectOfSessionP
- getSessionM
- getSessionP
- getStudent
- bookStudent
- getProject
- getProjectCourses
- getProjectRessources
- getProjectCourseSections

Exemple

```js
var u =await APIOC.getHistorySessionsBetween('2024-03-01','2024-03-31')
// u contiendra la liste des sessions comprises entre ces deux dates
```

API ACCOUNTING

- getFundings
- getBillableSessions
- getPreBill

Exemple
```js
// dans le cas où les tarifs des étudiants sont stockés sur une feuille googlesheet
var tFundings = await ACCOUNTING.getFundings({id:'1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc'})
// récupère les codes tarifs de vos étudiants
var u =await ACCOUNTING.getBillableSessions('2024-03-01','2024-03-31', tFundings)
// renvoie la facturation ligne a ligne des étudiants pour cette période
```
A propos de GoogleSheet

Format des données

| name             | financed | self_paid | apprenticeship |
|------------------|----------|-----------|----------------|
| AA               | TRUE     | FALSE     | FALSE          |
| BB               | FALSE    | FALSE     | TRUE           |

...

par défaut la première cellule(name) du tableau est attendue en B2 ; mais c'est paramétrable dans la fonction


getFundings(params={})
	params.id		: id de la feuille googlesheet
	params.query 	: chaine de requete de la feuille googlesheet par défaut 'select B,C,D,E limit 5000'

# Questions
- Comment trouver l'id d'une feuille googlesheet
> dans l'url, https://docs.google.com/spreadsheets/d/CECI_EST_MON_ID_GSHEET/edit?usp=sharing

- La feuille doit elle impérativement avoir été partagée
> Non
