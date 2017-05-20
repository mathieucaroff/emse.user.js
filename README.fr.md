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

# Fonctionnalités
Sur un certain nombre de pages, ce script propose la validation automatique des formulaires de connexion. La validation ne s'opère que si le formulaire de connexion est rempli (qu'ils aient été complété par le navigateur ou bien par le script).

Les fonctionnaliés sont aussi rapidement décrites dans le script. Chaque fonctionnalité peut être désactivée séparément. Voir la partie configuration.
 * fw-cgcp.emse.fr: Fait la validation automatique des formulaires de connexion. Tant que la page reste ouverte, vous reconnecte toute les 30 minutes (configurable) ou immédiatement si le temps restant est inférieur à 14 minutes (configurable aussi).
 * Promethee: Colore l'agenda par matière. Se base sur les lettres du nom de la matière pour calculer arbitrairement une couleur.
 * Promethee: Vous conduit automatiquement à la page 'Agenda'. Réalise aussi quelques redirections depuis certaines page d'erreur.
 * Campus: Lorsque vous souhaitez vous connecter, vous êtes automatiquement redirigé depuis la page de connexion de campus vers le CAS. Plus de risque d'essayer d'utiliser ce formulaire déroutant sur la gauche de la page.
 * Cas: Connexion (Validation automatique des formulaires de connexion).
 * School's wifi login pages (securelogin.arubanetworks.com): Connexion.
 * Campus CGCP (cloud-sgc.emse.fr:5001): Connexion.
 * Sogo: Connexion.
 * Sogo3: Connexion. / NE FONCTIONNE QUE LORSQUE LE FORMULAIRE EST REMPLI PAR LE NAVIGATEUR. / NE FONCTIONNE PAS LORSQU'IL EST REMPLI PAR LE SCRIPT. (L'interface de AngularJS est inhackable, elle requière que l'utilisateur ait manuellement entré des données avant de permettre la validation. Toute aide est la bienvenue.)

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

