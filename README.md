# OC-Mentor-Tools

![](https://img.shields.io/badge/build-pass-success)
![](https://img.shields.io/badge/version-0.1-orange)
[![](https://img.shields.io/badge/slack-blueviolet)](https://app.slack.com/client/THPGYG8JJ/C018VLPFKG8/)

## Préambule

Github réagissant très mal à ma configuration exotique, je ne peux pas garantir que les fichiers github seront àn jour.
Je vais créer un autre dépôt sur codeberg

## Comment ça fonctionne

### Installation de l'extension

Cf installation d'une extension en mode dev
Pour firefox dans l'url saisissez about:debugging et séléctionnez l'archive que vous venez de télécharger

#### Remarques

Il est possible de voir apparaitre des messages d'erreur dans la console
 - ceux qui vous disent que la constante est déjà définie : c'est normal et c'est du à la double injection (au chargement de l'addon, et au chargement de la page) ; ça n'apparait qu'après chargement de l'addon
 - ceux qui vous disent attention je n'ai pas sur télécharger le script xxx de l'extension, utilisation de l'url de fallback. C'est normal car dans cette version (debug) j'utilise (mais vous pouvez le faire aussi en definissant un serveur local) la possibilité d'utiliser un script local plutôt que celui integré dans le plugin pour debugger par exemple.

## Utilisation

Préalable: Notez que tout se passe dans la console il est possible que par la suite on puisse intéragir avec une ui

L'API ne fonctionne que si vous êtes connectés, de fait *JAMAIS* je ne demande ni stocke de mot de passe

### API OC
- getMe
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

#### APIOC.getMe

APIOC.getMe()

Pas de paramètre
Renvoie les informations vous concernant

exemple
```js
var r = await APIOC.getMe();)
```

#### APIOC.getUser

APIOC.getUser(iId)

iId : (entier) le numéro d'identification de l'utilisateur recherché
Renvoie les informations vous concernant (sous réserve de droit d'y accéder)

exemple
```js
var r = await APIOC.getUser(7688561);
// il s'agit de mon id
```

#### APIOC.getHistorySessionsBetween

APIOC.getHistorySessionsBetween(sFrom, sTo, oOpts={})

sFrom : date au format texte
sTo	  : date au format texte
oOpts : objet javascript qui n'est pas utilisé pour le moment mais devrait permettre de filtrer sur le type de sessions
- LIFE_CYCLE_STATUS_CANCELED 
- LIFE_CYCLE_STATUS_COMPLETED 
- LIFE_CYCLE_STATUS_LATE_CANCELED 
- LIFE_CYCLE_STATUS_ABSENT

**Notes**

Cette fonction est assez longue car l'API OpenClassrooms renvoie les données historiques depuis l'origine et par lot de 20 (mais on peut séléctionner l'indice de départ). De fait on a une fonction récursive qui crée des lots de 100 et sonde pour touver les bons indices

**Limite**

Pour éviter des récursion infinies en cas de bug j'ai limité à 10 itérations de traitement pour le moment.


**Exemple**

```js
var u=await APIOC.getHistorySessionsBetween('2024-03-01','2024-03-31')
// u contiendra la liste des sessions comprises entre ces deux dates
```

### API ACCOUNTING

- getFundings
- getBillableSessions
- getPreBill


#### ACCOUNTING.getFundings

Renvoir un tableau avec la liste des mode de facturation de vos étudiants

```js
// dans le cas où les tarifs des étudiants sont stockés sur une feuille googlesheet
var tFundings = await ACCOUNTING.getFundings({id:'1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc'})
```



#### ACCOUNTING.getBillableSessions

Renvoie la liste des sessions facturables d'une période


**Exemple**
```js
// dans le cas où les tarifs des étudiants sont stockés sur une feuille googlesheet
var tFundings = await ACCOUNTING.getFundings({id:'1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc'})
// récupère les codes tarifs de vos étudiants
var u = await ACCOUNTING.getBillableSessions('2024-03-01','2024-03-31', tFundings)
// renvoie la facturation ligne a ligne des étudiants pour cette période
```

**Note**
Dans cette version on prend soin de vérifier sur le tableau récapitulatif d'OpenClassrooms googlsheet de 1500 lignes) les niveaux de sessions, parfois ceux ci sont absents ce qui explique les message warning du log.

#### ACCOUNTING.getPreBill

Cette fonction permet d'obtenir un objet qui sera téléchargé puis exploité par un modele de facture généré par typst [typst](https://github.com/typst/typst). Prendre la version [binaire](https://github.com/typst/typst/releases) dans la section "Assets" qui vous convient


**Exemple**
```js
// dans le cas où les tarifs des étudiants sont stockés sur une feuille googlesheet
var tFundings = await ACCOUNTING.getFundings({id:'1Ko7nbOUrRHDoM2v_bxC85YuGBoao_IV2F3RLnqzMVgc'})
// récupère les codes tarifs de vos étudiants
var u =await ACCOUNTING.getBillableSessions('2024-03-01','2024-03-31', tFundings)
// renvoie la facturation ligne a ligne des étudiants pour cette période
```

## A propos de GoogleSheet

### Format des données

| name             | financed | self_paid | apprenticeship |
|------------------|----------|-----------|----------------|
| AA               | TRUE     | FALSE     | FALSE          |
| BB               | FALSE    | FALSE     | TRUE           |

...

par défaut la première cellule(name) du tableau est attendue en B2 ; mais c'est paramétrable dans la fonction

### Paramètres

getFundings(params={})
	params.id		: id de la feuille googlesheet
	params.query 	: chaine de requete de la feuille googlesheet par défaut 'select B,C,D,E limit 5000'

## Questions

### Generales

> Pourquoi certaines fois les résultats sont immédiats

Parce que les résultats de certaines fonctions lentes (typiquement liste de session) sont stockées en cache, le cache est injecté directement dans la page web ; donc tant que vous ne rafraichissez pas la page, le cache reste actif.

### API ACCOUNTING

>Pourquoi dois je saisir le mode de financement de l'étudiant

Parce que cette information n'est pas retournée dans l'API j'ai bien tenté d'exploiter celle qu'on trouve dans la fiche étudiant mais outre le fait qu'elle soit partielle (on ne sait rien des apprentis) mais sans succès (généation par js compressé après chargement de page)


>Comment trouver l'id d'une feuille googlesheet

Dans l'url, https://docs.google.com/spreadsheets/d/CECI_EST_MON_ID_GSHEET/edit?usp=sharing

> La feuille doit elle impérativement avoir été partagée

Non
