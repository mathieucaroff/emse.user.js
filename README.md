# emse.user.js
Student userscript for EMSE school.
This script performs auto-submit, skipping useless pages and redirections on the school pages.

This file has a French version [here](https://github.com/mathieucaroff/emse.user.js/blob/master/README.fr.md) (it may or may not be fully up to date).

# How to install
### Step 1: install a user script manager
Chrome / Opera / Safari / Vivaldi: [Tampermonkey extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
Firefox: [Greasmonkey extension](https://addons.mozilla.org/firefox/addon/greasemonkey/)
The page [Greasyfork](https://greasyfork.org/en) provides a more comprehensive list.

### Step 2: install the script
Copy the script from the file `emse.user.js` of the current repository [(link: emse.user.js)](https://github.com/mathieucaroff/emse.user.js/blob/master/emse.user.js). Create a new script with your userscript manager extension and paste the copied script in it.
Depending on the userscript extension you use, you may be offered to import it from the clipboard.

Avoid clicking the `Raw` button, otherwise the script will be installed with the update URL set. This means that updates will be automatically installed. This is not desirable if you want to set your username and password in the script or do any configuration: The modifications would be overwritten at each update. But if you don't want to do any configuration, then no problem in using the button.

# Features
This script offers auto-submitting for a few logging pages. Auto-submitting consists in having the script automatically validating the login form if it is filled (filled by the browser or by the script, both work).

The features are quickly described in the script as well. Each feature can be disabled separately. See configuration.

 * fw-cgcp.emse.fr: Performs auto login, and as long as the page is open, relogs you every 30 minutes (configurable), or immediately if the remaining time is less than 14 minutes (configurable too).
 * Promethee: Automatically takes you to the "Agenda" page. Redirects you from some error pages as well.
 * Campus: When you want to login, you are automatically redirected to the CAS page: No more risk of trying using that confusing form on the left.
 * Cas: Auto submitting.
 * School's wifi login pages (securelogin.arubanetworks.com): Auto submitting.
 * Campus CGCP (cloud-sgc.emse.fr:5001): Auto submitting.
 * Sogo: Auto submitting.
 * Sogo3: Auto submitting / WORKS ONLY WHEN THE LOGIN FORM IS FILLED BY YOUR WEB BROWSER / DOES NOT WORK WHEN FILLED BY THE SCRIPT (AngularJS unhackable interface which considers that the user must input some text before allowing form validation, any halp is welcomed).
 
You are otherwise encouraged to edit the code to fit your needs.

# Configuration
By default, the script only performs auto-submit / skipping useless pages / redirections. If you do not have the login form auto-completed by your web browser, you can enable this script to do so. You will have to set your username and/or your password as well as the options `global.fillusername` and `global.fillpassword` at the beginning of the code:

    global.fillusername = true;
    global.username = "YOUR.LOGIN";
    global.fillpassword = true;
    global.password = "YOUR.PASSWORD";
    
You can also disable any functionality of the script through the `enable` attribute each feature carries:

    "fw-cgcp.emse.fr:login": {
    		title: "Auto login on fw-cgcp.emse.fr",
    		description: "Automatically enters credentials on fw-cgcp.emse.fr. Auto send the completed form.",
    		enabled: true,
    		regex: "^https://fw-cgcp.emse.fr/auth/($|(auth|login).html)"
	    },

# Bug and error reporting, suggestions & feature request
Do them directly on the github repository's issue page.

