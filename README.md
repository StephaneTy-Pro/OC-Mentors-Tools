# Préambule

Github réagissant très mal à ma configuration exotique, je ne peux pas publier directement sur github
Dans ce répertoire vous ne trouverez donc que les différents fichiers finaux rangés par catégorie
Pour avoir les versions originales je vous enjoint à utiliser codeberg

# Comment ça fonctionne

## Installation de l'extension

Cf installation d'une extension en mode dev
Pour firefox dans l'url saisissez about:debugging et séléctionnez l'archive que vous venez de télécharger

## Remarques

Il est possible de voir apparaitre des messages d'erreur dans la console
 - ceux qui vous disent que la constante est déjà définie : c'est normal et c'est du à la double injection (au chargement de l'addon, et au chargement de la page) ; ça n'apparait qu'après chargement de l'addon
 - ceux qui vous disent attention je n'ai pas sur télécharger le script xxx de l'extension, utilisation de l'url de fallback. C'est normal car dans cette version (debug) j'utilise (mais vous pouvez le faire aussi en definissant un serveur local) la possibilité d'utiliser un script local plutôt que celui integré dans le plugin pour debugger par exemple.

## Utilisation

Préalable: Notez que tout se passe dans la console
