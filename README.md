# emse.user.js
Student userscript for EMSE school.

This script improves Promethee calendar, Campus, the fw-cgcp portal login and some other school pages. It skips useless pages and adds redirections. If you set your password in the script or if you use Firefox, it performs form auto-filling and auto-submitting of most login forms. See the #feature section below.

This file has a French version [here](https://github.com/mathieucaroff/emse.user.js/blob/master/README.fr.md) (it may or may not be fully up to date).

# How to install
### Step 1: install a user script manager
I recommand the Tampermonkey extension. It is available at different locations depending on your web browser:

For Chrome / Opera / Safari / Chromium / Vivaldi:

* https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo

For Firefox and its siblings

* https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/

Click the blue button to install the extension.

For a more comprehensive list of web browsers, see this page: [Greasyfork](https://greasyfork.org/en).


### Step 2: install the script
Copy the script from the file `emse.user.js` of the current repository [(link: emse.user.js)](https://github.com/mathieucaroff/emse.user.js/blob/master/emse.user.js). Create a new script and paste the copied script in it. This is done by clicking on the Tampermonkey icon (top right corner of your web browser window, right of the address bar), then selecting `Create a new script`.

Avoid clicking the `Raw` button: The default install procedure involves the script auto-update, based on the installation URL. This is not desirable if you want to set your username and password in the script or do any configuration: The modifications would be overwritten at each update. But if you don't want to do any configuration, then no problem with using the button.

Note: The script can be toggled on and off from the user script manager icon.

# Features
This script offers auto-submitting for a few logging pages. Auto-submitting consists in having the script automatically validating the login form if it is filled (filled by the browser or by the script, both work).

Note that:
 * The scripts begins with a few configuration lines that you may choose to fill or not. See the #configuration section below.
 * **Each feature can be disabled separately** (from the script code). See the #configuration section below.
 * The features are quickly described in the script as well as below.
 * You can tweak the features in the script.
 * I made some efforts to comment/document the script more than usually.

Feature list:
 * Promethee:
   * Brings colors to the agenda: Arbitrarily compute one color per subject, based on the letters of the subject's name. Set that color as background of the subject. Also works in month and array display mode since v1.03.
   * Removes Saturdays and Sundays from the month display mode to free space on the page.
   * Adds an "Expand" button in the agenda. This button expands the agenda frame to make it occupy the whole page.
   * Automatically takes you to the "Agenda" page when the site loads.
   * Automatically switch to the next week if it is weekend.
   * Redirects you from some error pages to the CAS login page, so as to relog you to Promethee.
   * Rename the tab to describe the content displayed.

 * fw-cgcp.emse.fr:
   1. Automatically complete and send the login form. This includes ticking the checkbox for the chart every 24h. [Does not work if you both did not input your password in the script and use Chrome.]
   2. [Provided (i) is used and the userinfo page is left opened] Relogs you every 30 minutes (configurable), or immediately if the remaining time is less than 14 minutes (configurable too).

 * Campus:
   * Folds the ICM category when page loads. (Somewhat useless, but not completely)
   * Automatically takes the login procedure:
     1. You are sent to the login page when arriving on campus.
     2. [Useless if you use (a)] The `login` button considers you are from EMSE and when clicked, sends you directly to the emse CAS login page, rather than the campus login page.
     3. [Useless if you use (b) or (a)] The campus login page automatically selects the EMSE authentification, so you aren't confused by the login form to the left.

* The script also performs automatic completion and submitting for the following locations [Does not work if you both did not input your password in the script and use Chrome.]:
  * Cas
  * School's wifi login pages (securelogin.arubanetworks.com)
  * Campus CGCP (cloud-sgc.emse.fr:5001)
  * Sogo
  * Sogo3 [Works only when the login form is filled by your web browser / does not work when filled by the script. This is due to AngularJS unhackable interface which considers that the user must input some text before allowing form validation. Any help is welcome.]
 
You are otherwise encouraged to edit the code to fit your needs.

# Configuration
By default, the script only performs automatic login form submitting / skipping useless pages / redirections. If you do not have the login form auto-completed by your web browser, you can enable this script to do so. You will have to set your username and/or your password at the beginning of the code:

    global.username = "YOUR.LOGIN";
    global.fillUsernameEnabled = true;
    global.password = "YOUR.PASSWORD";
    global.fillPasswordEnabled = true;
    
You can also disable any functionality of the script through the `enable` attribute each feature carries:

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

# Bug and error reporting, suggestions & feature requests
Do them directly on the Github repository issue page.

