# emse.user.js
Userscript pour les étudiants de l'École des Mines de Saint-Étienne.
Ce script réalise l'auto-validation des formulaires de connexion, passe les pages inutiles et réalise quelques redirections automatiques lorsque la page atteinte est inutile.

Ce fichier README existe aussi en version anglaise [ici](https://github.com/mathieucaroff/emse.user.js/blob/master/README.md).
La version française n'est pas nécessairement bien maintenue à jour.

# Installation
### Étape 1: Installer un gestionnaire de script utilisateur
Chrome / Opera / Safari / Vivaldi: [extension Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
Firefox: [extension Greasmonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)
Consulter la page [Greasyfork](https://greasyfork.org/fr) pour une liste plus complète.

### Step 2: Installer le script
Copiez le script depuis le fichier `emse.user.js` du repository actuel [(lien: emse.user.js)](https://github.com/mathieucaroff/emse.user.js/blob/master/emse.user.js). Créez un nouveau script avec votre extension de gestion des userscripts, et collez y le script copié. Suivant votre extension de gestion des userscripts, vous pouvez vous voire proposer d'installer directement le script depuis le clipboard.

Évitez de cliquer sur le bouton `Raw`, sinon le script sera installé avec l'URL de mise à jour paramétré. Ceci signifie que les mises à jour seront automatiquement installées. Ce n'est pas désirable si vous souhaitez paramétrer votre login et mot de passe dans le script ou que vous souhaitez faire la moindre configuration. En effet, les modifications seraient écrasées à chaque mise à jour. Cependant, si vous ne souhaitez pas toucher à la configuration, il n'y a pas de problème à utiliser le bouton `Raw`.

Note: Le script peut être désactivé et réactivé depuis l'icone du gestionnaire de userscript.

# Fonctionnalités
Sur un certain nombre de pages, ce script propose la validation automatique des formulaires de connexion. La validation ne s'opère que si le formulaire de connexion est rempli (qu'ils aient été complété par le navigateur ou bien par le script).

Les fonctionnaliés sont aussi rapidement décrites dans le script. **Chaque fonctionnalité peut être désactivée séparément.** Voir la partie configuration.
Liste des fonctionalitées:
 * Promethee:
   * Colore l'agenda par matière. Se base sur les lettres du nom de la matière pour calculer arbitrairement une couleur. Fonctionne aussi en affichage tableau et par mois depuis la version 1.03.
   * Cache les colonnes des samedi et dimanche en affichage par mois (v1.03+).
   * Vous conduit automatiquement à la page 'Agenda'. Réalise aussi quelques redirections depuis certaines page d'erreur.
 * fw-cgcp.emse.fr:
   1. Fait la validation automatique des formulaires de connexion.
   2. [En supposant que (i) est utilisé] Tant que la page reste ouverte, vous reconnecte toute les 30 minutes (configurable) ou immédiatement si le temps restant est inférieur à 14 minutes (configurable aussi).
 * Campus:
   * Replie le volet ICM lorsque la page se charge, pour donner un acces directe au volet ISMIN.
   * Automatise les procédure de connexion:
     1. Vous êtes envoyés sur la page de login dès votre arrivée sur campus.
     2. [Inutile si vous utilisez (a)] Le bouton `Connexion` considère que vous êtes de l'EMSE, et vous envoye directement sur le CAS, plutôt que sur la page de connexion de campus.
     3. La page de connexion de campus vous redirige automatiquement vers le CAS. Plus de risque d'essayer d'utiliser ce formulaire déroutant sur la gauche de la page.
 * Le script s'occupe aussi de la completion et de l'envoie des formulaires de connexion pour les pages suivantes [Si vous utilisez Chrome, ceci ne fontionne que si vous avez entré votre mot de passe dans le script.] :
    * Cas
    * School's wifi login pages (securelogin.arubanetworks.com)
    * Campus CGCP (cloud-sgc.emse.fr:5001)
    * Sogo
    * Sogo3 [Ne fonctionne que lorsque le formulaire est rempli par le navigateur / ne fonctionne pas lorsqu'il est rempli par le script. Le problème est l'interface de AngularJS : elle requière que l'utilisateur ait manuellement entré des données avant de permettre la validation. Toute aide est bienvenue.]

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

