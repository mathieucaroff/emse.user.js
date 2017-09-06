# emse.user.js
Userscript pour les étudiants de l'École des Mines de Saint-Étienne.

Ce script ajoute des couleurs dans l'agenda Promethee et améliore Promethee de plusieurs autre manières plus discrètes.
Il valide aussi automatiquement les formulaires de connexion sur la plupart des pages de l'école (fw-cgcp, cas, campus, campus-cgcp, sogo). Notamment, sur fw-cgcp.emse.fr, tant que l'onglet reste ouvert, vous  êtes automatiquement reconnecté toutes les 30 minutes (durée configurable).

Ce fichier README existe aussi en version anglaise [ici](https://github.com/mathieucaroff/emse.user.js/blob/master/README.md).
La version française n'est pas nécessairement bien maintenue à jour.

# Installation
### Étape 1: Installer un gestionnaire de script utilisateur
L'extension à installer est différente suivant votre navigateur web :
Chrome / Opera / Safari / Chromium / Vivaldi : [extension Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- Depuis la page du lien ci dessus, cliquer sur le bouton bleu en haut à droit pour installer l'extension.

Firefox : [extension Greasmonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)
- Sur la page du lien ci-dessus, cliquer sur le bouton vert à gauche pour installer l'extension. Un redémarage de Firefox sera nécessaire. Après le redémarrage, Firefox réouvrira les onglets qui était présent avant.

Consultez la [page d'accueil de Greasyfork](https://greasyfork.org/fr) pour une liste plus complète des extensions à utiliser selon le navigateur.

### Étape 2: Installer le script
Copiez le script depuis le fichier `emse.user.js` du repository actuel [(lien: emse.user.js)](https://github.com/mathieucaroff/emse.user.js/blob/master/emse.user.js). Créez un nouveau script avec votre extension de gestion des userscripts, et collez-y le script copié. **Pour créer un script, cliquez sur le bouton de l'extension en haut à droite de votre navigateur, puis `Créer un script` ou bien `Nouveau script utilisateur`.** Suivant votre extension de gestion des userscripts, vous pouvez vous voire proposer d'installer directement le script depuis le clipboard (bouton en bas à gauche pour Greasmonkey).

Évitez de cliquer sur le bouton `Raw` sur la page du fichier `emse.user.js`. Sinon, le script sera installé avec l'URL de mise à jour paramétré. Ceci signifie que les mises à jour seront automatiquement installées. Ce n'est pas désirable si vous souhaitez paramétrer votre login et mot de passe dans le script ou que vous souhaitez faire la moindre configuration. En effet, les modifications seraient écrasées à chaque mise à jour. Cependant, si vous ne souhaitez pas toucher à la configuration, il n'y a pas de problème à utiliser le bouton `Raw`.

Note: Le script peut être désactivé et réactivé depuis l'icône du gestionnaire de userscript.

# Fonctionnalités
Sur un certain nombre de pages, ce script propose la validation automatique des formulaires de connexion. La validation ne s'opère que si le formulaire de connexion est rempli (qu'ils aient été complétés par le navigateur ou bien par le script).

Notez que:
 * Le script commence par une courte partie de configuration que vous pouvez choisir de compléter ou de laisser tel quel. Voir la partie #configuration ci-dessous.
 * **Chaque fonctionnalité du script peut être désactivée séparément.** Voir la partie #configuration ci-après.
 * Chaque fonctionnalité est rapidement décrite dans le script, ainsi que dans la liste ci-dessous.
 * Vous pouvez modifier les fonctionnalités du script. Certaines suivent un schéma très simple.
 * Le script est plus ou moins bien commenté et documenté.

Liste des fonctionnalités :
* Promethee:
  * Colore l'agenda par matière. Se base sur les lettres du nom de la matière pour calculer arbitrairement une couleur. Fonctionne aussi en affichage tableau et par mois depuis la version 1.03.
  * Ajoute un bouton pour agrandir l'agenda, et cacher les éléments de menu, et un bouton pour revenir à l'affichage normal.
  * Cache les colonnes des samedi et dimanche en affichage par mois (v1.03+).
  * Vous conduit automatiquement à la page 'Agenda'.
  * Le week-end, affiche par défaut la semaine à venir plutôt que la semaine passée.
  * Redirige depuis certaines page d'erreur vers la page de login CAS pour vous reloguer sur Promethee.
  * Renomme les onglets pour que leur titre décrivent leur contenu.
* fw-cgcp.emse.fr:
  1. Fait la validation automatique des formulaires de connexion.
  2. [En supposant que (i) est utilisé] Tant que la page reste ouverte, vous reconnecte toute les 30 minutes (configurable) ou immédiatement si le temps restant est inférieur à 14 minutes (configurable aussi).
* Campus:
  * Replie le volet ICM lorsque la page se charge, pour donner un acces directe au volet ISMIN. (Partiellement obsolète)
  * Automatise les procédure de connexion :
    1. Vous êtes envoyés sur la page de login dès votre arrivée sur campus.
    2. [Inutile si vous utilisez (a)] Le bouton `Connexion` considère que vous êtes de l'EMSE, et vous envoye directement sur le CAS, plutôt que sur la page de connexion de campus.
    3. La page de connexion de campus vous redirige automatiquement vers le CAS. Plus de risque d'essayer d'utiliser ce formulaire déroutant sur la gauche de la page.
* Le script s'occupe aussi de la completion et de l'envoi des formulaires de connexion pour les pages suivantes [Si vous utilisez Chrome, ceci ne fonctionne que si vous avez entré votre mot de passe dans le script.] :
  * Cas
  * La page de connexion au wifi de l'école (securelogin.arubanetworks.com)
  * Campus CGCP (cloud-sgc.emse.fr:5001 ou 172.16.160.10:5001)
  * Sogo et Sogo3

Vous êtes aussi encouragés à éditer le code pour qu'il réponde a vos besoins.

# Configuration
Par défaut, le script ne fait que auto-valider / passer les pages inutiles / rediriger. Si vous ne faites pas remplir les formulaires de connexion par votre navigateur, vous pouvez les faire remplir par ce script. Il vous faudra paramétrer votre username et votre mot de passe, ainsi que les options `global.fillusername` et `global.fillpassword` au début du code :

    global.fillusername = true;
    global.username = "YOUR.LOGIN";
    global.fillpassword = true;
    global.password = "YOUR.PASSWORD";

Vous pouvez désactiver n'importe quelle fonctionnalité du script via l'attribut `enable` que comporte chaque fonctionnalité :

    "fw-cgcp.emse.fr:auth": {
      title: "Auto login on fw-cgcp.emse.fr",
      description: "Automatically enters credentials on fw-cgcp.emse.fr. Auto send the completed form.",
      enabled: true,
      tested: FILL_SUBMIT * MOZILLA + BROWSERFILL_SUBMIT * MOZILLA,
      regex: "^https://fw-cgcp.emse.fr/auth/auth.html",
      action: action.fillAndSubmitForm,
      usernameInputId: "n_uid",
      passwordInputId: "pswd"
    },

# Signalement de bugs et erreurs, suggestions & demandes de nouvelles fonctionnalités
Faites les directement sur la page "issue" de ce repository github.

