// ==UserScript==
// @name        EMSE
// @namespace   oxyde.org
// @include     /^https?://[a-zA-Z0-9_-]+[.]emse[.]fr/
// @include     /^https?://172[.]16[.]160[.]10:5001/
// @include     /^https?://securelogin[.]arubanetworks[.]com/
// @include     /^https?://www[.]msn[.]com/fr-fr/.*[?](.*&?ocid=wispr|.*&?pc=u477){2}/
// @author      Mathieu CAROFF
// @version     1.04
// @grant       none
// @run-at      document-end
//
// @description Student userscript for EMSE school.
//
// ==/UserScript==

/** Description **
 * This script, written for ISMIN student of EMSE, improves Promethee calendar, Campus, the fw-cgcp portal login
 * and some other school pages. It skips useless pages and adds redirections. If you set your password in the script
 * or if you use Firefox, it performs form auto-filling and auto-submitting of most login forms.
 **/
/** Domain
 * It affects *.emse.fr. 
 * Features are executed on the following subdomains:
 *     {fw-cgcp, cas, campus, campus-cgcp, sogo}.emse.fr
 *
 * The prafixes {172[.]16[.]160[.]10:5001, securelogin[.]arubanetworks[.]com and www[.]msn[.]com/fr-fr/}
 * are respectively: {Campus CGCP server ip, wifi login page (for auto-completion) and wifi landing page (for redirection)}.
 *
 * The only way to be sure that a script isn't malicious is to read the whole code and make sure it contains nothing malicious.
 **/
/** Configuration
 * Filling the configuration section is not necessary to use ths script properly. For any missing information, the script
 * adapts to doing what it can.
 **/

(_ => {

//////////////////////////
//    Configuration     //
//////////////////////////

var debug = false;

var global = {};

// Username is optional
global.username = "YOUR.LOGIN";
global.fillUsernameEnabled = true;
// global.fillUsernameEnabled overwritten to false if `username` is set to "" or to "YOUR.LOGIN"

// Password is optional.
// Filling Password is rather useless if Username isn't filled too.
global.password = "YOUR.PASSWORD";
global.fillPasswordEnabled = true;
// global.fillPasswordEnabled overwritten to false if `password` is set to "" or to "YOUR.PASSWORD"

// Should the forms be autosubmitted if they are ready to be ?
global.autosubmit = true;

// Should colors of each time of the timetable be changed on Promethee?
global.prometheeColorsEnabled = true;
// Should weekends be removed when in month mode, to gain room on the page ?
global.prometheeMonthRemoveWeekEnd = true;

// Should you be logged automatically on campus.emse.fr ?
global.campusAutologin = true;

 
// Overwriting the two below values, so as to be able to ship the script with
// `global.fillUsernameEnabled = true;` and
// `global.fillPasswordEnabled = true;` by default.
global.fillUsernameEnabled &= !(global.userename == "" || global.username === "YOUR.LOGIN");
global.fillPasswordEnabled &= !(global.password == "" || global.password === "YOUR.PASSWORD");

// You can disable / enable each feature separately.
// URegex != Regexp. See note below `features_`.
// To understand missing variables in features_`, see `function main ()`
var features_ = _ => ({
  // | Promethee |
  "promethee.emse.fr:rainbow": {
    title: "Add color to the agenda subjects",
    description: "Hash the name of each subject of the agenda into a color. Set that color as background of the subject block. Works in all calendar viewing modes: weekly, monthly and array. Elements are selected using XPath or querySelectorAll.",
    enabled: global.prometheeColorsEnabled && true,
    tested: FIREFOX + CHROME,
    uregex: "^https%?://promethee.emse.fr/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp",
    action: specifiedLater
  },
  "promethee.emse.fr:noweekend": {
    title: "Remove week-ends on monthly calendar",
    description: "Use XPath to select elements corresponding to Saturday or Sunday. Delete them from the view.",
    enabled: global.prometheeMonthRemoveWeekEnd && true,
    tested: FIREFOX + CHROME,
    uregex: "^https%?://promethee.emse.fr/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp",
    action: specifiedLater
  },
  "promethee.emse.fr:expandShrink": {
    title: "Add expand and shrink buttons to the agenda frame.",
    description: "The expand is a link to the url of it's frame. The shrink button is a link to promethee.emse.fr.",
    enabled: global.prometheeColorsEnabled && true,
    tested: FIREFOX + CHROME,
    uregex: "^https%?://promethee.emse.fr/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp",
    action: specifiedLater
  },
  "promethee.emse.fr:defaultTab:agenda": {
    title: "Agenda tab as default",
    description: "Automatically select the agenda tab on promethee.emse.fr.",
    enabled: true,
    tested: FIREFOX + CHROME,
    uregex: "^https%?://promethee.emse.fr/OpDotNet/Eplug/Portail/PortailDefault.aspx?intIdGroupe=31$",
    action: formtools.elementClicker("#lnk1")
  },
  "promethee.emse.fr:nextWeek": {
    title: "Display next week when relevent",
    description: "During weekends, load the next week as default week.",
    enabled: true,
    tested: UNTESTED,
    uregex: "^https%?://promethee.emse.fr/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp?",
    action: (me) => {
      if (todayIsWeekend()) {
        formtools.elementClicker("#DivVis > table > tbody > tr > td:last-child > a")();
      }
    }
  },
  "promethee.emse.fr:errorRedirection": {
    title: "Promethee error page redirection",
    description: "Add redirection from a promethee error pages, to reload the page correctly",
    enabled: true,
    tested: FIREFOX + CHROME,
    uregex: "^https://promethee.emse.fr/(commun/erreur.asp?code=[0-9]%+|OpDotNet/Commun/OPErreur.aspx?errCode=[0-9]%+)",
    redirectionDestination: "https://cas.emse.fr/login?service=https://promethee.emse.fr/opdotnet/",
    action: (me) => {
      log("EMSE.user.js about to apply redirection");
      action.applyRedirection(me);
    }
  },
  "promethee.emse.fr:renameTab": {
    title: "Promethee change page title",
    description: "Rename the page for its title to be more descriptive of it's content.",
    enabled: true,
    tested: FIREFOX + CHROME,
    uregex:"^https://promethee.emse.fr",
    uregexNamingPrefix: "^https://promethee.emse.fr",
    uregexNamingPairs: [ /* uregex != regex */
    ["Promethee", "/opdotnet/eplug/portail/PortailDefault.aspx?%.*intIdPageCourante=P2012"],
    ["Agenda",  "/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp"],
    ["maFiche", "/opdotnet/eplug/portail/PortailDefault.aspx?%.*intIdPageCourante=P2016"]
    ],
    action: (me) => {
      window.document.title = "Promethee";
      for (let pair of me.uregexNamingPairs) {
        let uregex = me.uregexNamingPrefix + pair[1];
        if (urlmatch(uregex)) {
          let tabName = pair[0];
          window.top.document.title = tabName;
        }
      }
    }
  },

  // | fw-cgcp |
  "fw-cgcp.emse.fr:login": {
    title: "Auto login on fw-cgcp.emse.fr",
    description: "Automatically enters credentials on fw-cgcp.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: FILL_SUBMIT * FIREFOX + BROWSERFILL_SUBMIT * FIREFOX,
    uregex: "^https://fw-cgcp.emse.fr/auth/($|login.html)",
    action: action.fillAndSubmitForm,
    usernameInputId: "uid",
    passwordInputId: null
  },
  "fw-cgcp.emse.fr:auth": {
    title: "Auto login on fw-cgcp.emse.fr",
    description: "Automatically enters credentials on fw-cgcp.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: FILL_SUBMIT * FIREFOX + BROWSERFILL_SUBMIT * FIREFOX,
    uregex: "^https://fw-cgcp.emse.fr/auth/auth.html",
    action: action.fillAndSubmitForm,
    usernameInputId: "n_uid",
    passwordInputId: "pswd"
  },
  "fw-cgcp.emse.fr:confirmORredirect": {
    title: "Auto confirm on fw-cgcp.emse.fr",
    description:`
If it finds a checkbox, it automatically ticks it to say you read the use conditions. Then validate.
If it doesn't find one, it redirects to {redirectionDestination}, see below.`,
    redirectionDestination: "https://fw-cgcp.emse.fr/auth/userinfo.html",
    enabled: true,
    tested: FIREFOX + CHROME,
    uregex: "^https://fw-cgcp.emse.fr/auth/plain.html$",
    action: specifiedLater
  },
  "fw-cgcp.emse.fr:relog": {
    title: "Auto relog on fw-cgcp.emse.fr",
    description: "Automatically goes from the 'Remaining time' page to the 'Login' page when the elapsed time exceeds `elapsedTimeThreshold`, or the remaining time goes below `remainingTimeThreshold`",
    enabled: true,
    tested: FIREFOX,
    uregex: "^https://fw-cgcp.emse.fr/auth/userinfo.html$",
    redirectionDestination: "https://fw-cgcp.emse.fr/auth/auth.html",
    // ALL TIMES ARE EXPRESSED IN SECONDS (NOT MILLISECONDS).
    elapsedTimeThreshold:  60 * ( 60 * 0 + 30 ) + 0,
    remainingTimeThreshold:  60 * ( 60 * 0 + 14 ) + 0,
    action: specifiedLater
  },

  // | Campus |
  "campus.emse.fr:fold": {
    title: "Fold ICM category on campus.emse.fr",
    description: "Folds the ICM category by default on campus.emse.fr.",
    enabled: true,
    tested: FIREFOX + CHROME,
    uregex: "^https%?://campus.emse.fr",
    action: specifiedLater
  },
  "campus.emse.fr:autologin": {
    title: "Loads the login page when you aren't logged.",
    description: "Automatically redirect you to the cas login page when you aren't logged on campus.emse.fr.",
    enabled: global.campusAutologin && true,
    tested: FIREFOX + CHROME,
    uregex: "^https%?://campus.emse.fr",
    action: launcher(_ => {
      let buttonlist = document.getElementsByClassName("button_connect_emse");
      if (buttonlist.length > 0) {
        let button = buttonlist[0];
        button.click();
      }
    })
  },
  "campus.emse.fr:loginbutton": {
    title: "Sets the login button to send you to CAS directly.",
    description: "The link is extracted from the EMSE login button.",
    enabled: true,
    tested: FIREFOX + CHROME,
    uregex: "^https%?://campus.emse.fr",
    action: launcher(_ => {
      let emseButtonlist = document.getElementsByClassName("button_connect_emse");
      let destination;
      if (emseButtonlist.length > 0) {
        destination = emseButtonlist[0].onclick.toString().split("'")[1];
      } else {
        destination = "https://campus.emse.fr/Shibboleth.sso/Login?entityID=https%3A%2F%2Fshibbo.emse.fr%2Fidp%2Fshibboleth&target=https%3A%2F%2Fcampus.emse.fr%2Fauth%2Fshibboleth%2Findex.php";
      }
      for (let loginButton of Array.from(document.querySelectorAll(".standardbutton.plainlogin.btn"))) {
        loginButton.href = destination;
        loginButton.onclick = null;
      }
    })
  },
  "campus.emse.fr:login-redirection": {
    title: "Auto select the CAS login link on campus.emse.fr/login page.",
    description: "Automatically redirects you from the (deceiving) campus login page to the cas login page.",
    enabled: true,
    tested: FIREFOX + CHROME,
    uregex: "^https%?://campus.emse.fr/login",
    action: formtools.elementClicker(".alert a")
  },

  // Cas
  "cas.emse.fr:login": {
    title: "Auto login on cas.emse.fr",
    description: "Automatically enters credentials on cas.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: (FILL_SUBMIT + BROWSERFILL_SUBMIT + FILL_NOSUBMIT + NOFILL_NOSUBMIT) * FIREFOX + FILL_SUBMIT * CHROME,
    uregex: "^https%?://cas.emse.fr/login",
    action: action.fillAndSubmitForm,
    usernameInputId: "username",
    passwordInputId: "password"
  },

  // Schools wifi login pages:
  // securelogin.arubanetworks.com for eduspot, ELEVE and INVITE wifi networks
  "securelogin.arubanetworks.com:login": {
    title: "Auto login on some of the school wifi networks",
    description: "Automatically enters credentials on securelogin.arubanetworks.com. Auto send the completed form.",
    enabled: true,
    tested: FILL_SUBMIT * FIREFOX,
    uregex: "^https%?://securelogin.arubanetworks.com/cgi-bin/login",
    action: action.fillAndSubmitForm,
    usernameInputId: "user",
    passwordInputId: "password"
  },
  
  // Wifi fall page:
  // https://www.msn.com/fr-fr/?ocid=wispr&pc=u477
  // I want to block it. Here is a redirection from it:
  "msn.com:fallpageRedirection:": {
    title: "Redirect from msn.com/ wifi fallpage",
    description: "When logging with some wifi network, you are redirected to this page for no reason once logged. This should not be so here is a redirection feature.",
    redirectionDestination: "https://fr.wikipedia.org/wiki/Special:Random",
    enabled: true,
    tested: UNTESTED,
    uregex: "https://www.msn.com/fr-fr", /* No need for a more specific match: It has already been done for script activation. See @include in the script header */
    action: action.applyRedirection
  },

  // Campus GCP
  "CAMPUS GCP:login": {
    title: "Auto login on CAMPUS GCP server",
    description: "Automatically enters credentials on CAMPUS GCP server. Auto send the completed form.",
    enabled: true,
    tested: FILL_SUBMIT * FIREFOX + FILL_SUBMIT * CHROME + BROWSERFILL_SUBMIT * FIREFOX + NOFILL_NOSUBMIT * FIREFOX,
    uregex: "^https://(cloud-sgc.emse.fr|172.16.160.10):5001",
    action: action.fillAndSpecialSubmitForm,
    usernameInputId: "login_username",
    passwordInputId: "login_passwd",
    specialSubmit: formtools.elementClicker("#login-btn")
  },

  // sogo
  "sogo.emse.fr:login": {
    title: "Auto login on sogo.emse.fr",
    description: "Automatically enters credentials on sogo.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: FILL_SUBMIT * FIREFOX + FILL_SUBMIT * CHROME + NOFILL_NOSUBMIT * FIREFOX, // Couldn't test BROSERFILL_SUBMIT, your help is welcome =)
    uregex: "^https://sogo.emse.fr/(SOGo|login)",
    action: action.fillAndSpecialSubmitForm,
    usernameInputId: "userName",
    passwordInputId: "password",
    specialSubmit: formtools.elementClicker("#submit")
  },
  "sogo3.emse.fr:login": {
    title: "Auto login on sogo3.emse.fr",
    description: "Automatically enters credentials on sogo3.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: BROWSERFILL_SUBMIT * FIREFOX + NOFILL_NOSUBMIT * FIREFOX + FAILED(FILL_SUBMIT * FIREFOX) + FAILED(FILL_SUBMIT * CHROME),
    uregex: "^https://sogo3.emse.fr/(SOGo|login)",
    action: action.fillAndSpecialSubmitForm,
    usernameInputId: "input_1",
    passwordInputId: "input_2",
    specialSubmit: formtools.elementClicker(".md-fab")
  }
});
// About URegex:
// Url Regexp are sligthly different from regex:
// Characters '.', '?' and '+' are escaped using brackets.
// To use them as in normal regex, you must escape them using '%':
// Use '%.', '%?' and '%+' and also '%%' to get a single '%'
// See `function urlmatch (me) {` below.

// testFlags [
var UNTESTED = 0;
var DISABLED = 0;
var FAILED = (...args) => null;
var TESTED = 1;

var NOFILL_NOSUBMIT = 1;
var BROWSERFILL_SUBMIT = 1;
var FILL_NOSUBMIT = 1;
var FILL_SUBMIT = 1;

var FIREFOX = 1;
var CHROME = 1;

var IN_DEVELOPMENT = -1;

// ] testFlags

function nothing (...args) {}

var specifiedLater = "specifiedLater";
var log = debug ? console.log : nothing;
var uregexlog = nothing;
var matchlog = log;
var submitlog = nothing;

function logError (...args) {
  log.apply(window, ["Error: "].concat(args));
}

function main () {
  var features = features_();
  laterSpecifiedActions(features);
  for (let name in features) {
    let me = features[name];
    if (urlmatch(me.uregex)) {
      if (me.enabled) {
        matchlog("MATCH:", me.title);
        try {
          me.action(me);
        } catch (err) {}
      } else {
        matchlog("DISABLED", me.title);
      }
    }
  }
}

function urlmatch (uregex) {
  uregexlog("     RAW ureg: ", uregex);
  let regstr = uregex.replace(/([^%])([.?+])/g, "$1[$2]").replace(/%([%.?+])/g, '$1');
  uregexlog("COMPILED ureg: ", regstr);
  return location.href.match(new RegExp(regstr));
}

function hashString (string) {
  var hash = 0, i, chr;
  for (i = 0; i < string.length; i++) {
    chr   = string.charCodeAt(i);
    hash  = ((hash << 4) - hash) + chr + 5;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function normalizeString (string) {
    return string.replace(/[\W\d]/g, '').toLowerCase();
}

function genColorFromHash (hash) {
  let r = ((hash & 0xFF0000) >> 16);
  let g = ((hash & 0x00FF00) >>  8);
  let b = ((hash & 0x0000FF) >>  0);
  let sat = 0.55; //saturation
  let compl = 256 * (1 - sat);
  function customHex (col) {
      let paleColor = Math.floor(col * sat + compl);
      let str = ("0" + paleColor.toString(16)).substr(-2);
      return str;
  }
  return "#" + customHex(r) + customHex(g) + customHex(b);
}

function formatTime (sec) {
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - 3600 * hours) / 60);
  let seconds = sec - 3600 * hours - 60 * minutes;
  let timeString = "";
  if (hours >= 1) {
    timeString = `${hours}h${minutes}min${seconds}s (${sec}s)`;
  } else if (minutes >= 1) {
    timeString = `${minutes}min${seconds}s (${sec}s)`;
  } else {
    timeString = `${seconds}s (${sec}s)`;
  }
  return timeString;
}

function todayIsWeekend () {
  return new Date().getDay() % 6 === 0; // 0 is Sunday. 6 is Saturday. This tests for weekend.
}

function waiterForAtMostEveryThen (testFun, attempts, millisecs, callback) {
  function waiter () {
    if (attempts-- <= 0) return;
    else if (testFun()) callback();
    else setTimeout(waiter, millisecs);
  }
  return waiter;
}

function XPathQuery (query, elem) {
  let queryResult = document.evaluate(query, elem, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
  let matchingNodeArray = [];
  let mnode;
  while (mnode = queryResult.iterateNext()) {
    matchingNodeArray.push(mnode);
  }
  return matchingNodeArray;
}

function importCss (href) {
  var link  = document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  link.media = 'all';
  document.head.appendChild(link);
}

////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

function launch (func) {
  let schedule_id;
  function schedule_func () {
    for (let t of [0]) { //, 100, 200, 300, 500, 1000, 1500]) {
      setTimeout(func, t);
    }
    clearTimeout(schedule_id);
    schedule_id = setTimeout(schedule_func, 3000);
  }
  schedule_id = schedule_func();
  document.body.addEventListener("load", schedule_func, true);
  //func();
}

function launcher (func) {
  return (me) => {
    func.me = me;
    launch(func);
  };
}


var action = {};

action.applyRedirection = function (me) {
  window.top.location.assign(me.redirectionDestination);
};

action.fillAndSubmitForm = function (me) {
  launch(_ => {
    formtools.fill(me);
    formtools.submit(me);
  });
};

action.fillAndSpecialSubmitForm = function (me) {
  launch(_ => {
    formtools.fill(me);
    if (global.autosubmit) {
      me.specialSubmit();
    }
  });
};

action.topifyFrame = function (me) {
  if (window.top !== window) {
    window.top.location.replace(location.href);
  }
};


var formtools = {};

formtools.readInputById = function (id) {
  let input = document.getElementById(id);
  return input ? input.value : null;
};
formtools.testInputSubmitabilityById = function (id) {
  if (id === null) {
    return true;
  }
  if (!id) {
    return false;
  }
  if (id) {
    let input = document.getElementById(id);
    if (input) {
      if (input.getAttribute("noautosubmit")) {
        return false;
      } else {
        if (input.value) {
          return true;
        } else {
          input.setAttribute("noautosubmit", "true");
          return false;
        }
      }
    }
    if (!input) {
      return true;
    }
  }
};
formtools.fillInputById = function (id, value) {
  let input = document.getElementById(id);
  if (input) {
    input.value = value;
  }
  return !!input;
};
formtools.fill = function (me) {
  let uiid = me.usernameInputId;
  let piid = me.passwordInputId;
  if (global.fillUsernameEnabled) {
    formtools.fillInputById(uiid, global.username);
  }
  if (global.fillPasswordEnabled) {
    formtools.fillInputById(piid, global.password);
  }
};
formtools.submit = function (me) {
  let uiid = me.usernameInputId;
  let piid = me.passwordInputId;
  if (global.autosubmit) {
    if ([uiid, piid].every(formtools.testInputSubmitabilityById)) {
      for (let inputid of [uiid, piid]) {
        let input = document.getElementById(inputid);
        if (input) {
          submitlog("Found input,", input, "#"+inputid, "in formtools.submit");
          input.form.submit();
        }
      }
    }
  }
};
formtools.elementClicker = function (selector) {
  return _ => {
    let element = document.querySelector(selector);
    if (element) {
      element.click();
    }
  };
};

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


function laterSpecifiedActions (features) {
  features["fw-cgcp.emse.fr:confirmORredirect"].action = (me) => {
    var btn = document.getElementById("accept_btn");
    if (btn) {
      var tickbox = btn.form.querySelector("input[name=read]");
      setTimeout(_ => tickbox.click(), 400);
      setTimeout(_ => btn.click(), 1000);
    } else {
      action.applyRedirection(me)
    }
  };

  features["fw-cgcp.emse.fr:relog"].action = (me) => {
    var loadNextPage = function () {
      action.applyRedirection(me);
    };
    var relogTime = me.elapsedTimeThreshold;

    var box = document.querySelector("#contentmiddle > div.box");
    var match = box.textContent.match(/(\d*)[^\d]+(\d+)[^\d]*$/); // \d == [0-9]
    if (match) {
      let hour = parseInt(match[1]);
      let min = parseInt(match[2]);
      let remainingTime = 60 * (60 * hour + min) + 0; // in seconds
      if (remainingTime <= me.remainingTimeThreshold) {
        loadNextPage();
      }
      else if (remainingTime - me.remainingTimeThreshold < relogTime) {
        relogTime = Math.min(relogTime, remainingTime - me.remainingTimeThreshold);
      }
    }
    setTimeout(loadNextPage, 1000 * relogTime);
    if (box.textContent.match("Welcome|Bienvenue")) {
      box.insertAdjacentHTML('beforeend', `
  <br/>You will be relogged whenever the elapsed time exceeds ${formatTime(me.elapsedTimeThreshold)}, or the remaining time goes below ${formatTime(me.remainingTimeThreshold)}.
  <br/>This will happend in ${formatTime(relogTime)}.`);
    }
  };

  features["campus.emse.fr:fold"].action = (me) => {
    for (let h of document.querySelectorAll(".categoryname")) {
      if (h.textContent == "ICM") {
        let icmdiv = h.parentElement.parentElement;
        icmdiv.classList.add("collapsed");
      }
    }
  };

  function setElementsColorToRainbow (elemarray, title) {
    if (title) {
      let hash = hashString(normalizeString(title));
      let color = genColorFromHash(hash);
      for (let elem of elemarray) {
        if (elem) {
          elem.style.backgroundColor = color;
          //elem && elem.setAttribute("bgcolor", color);
        }
      }
    }
  }

  function rainbowSetter () {
    let divVis = document.getElementById("DivVis");
    /* Week page display mode */
    let tdQuery = "table/tbody/tr[2]/td/table/tbody/tr[position()>1]/td[position()>1][@class='GEDcellsouscategorie'][@bgcolor]";
    for (let td of XPathQuery(tdQuery, divVis)) {
      let queryResult = XPathQuery("table/tbody/tr/td/b", td);
      for (let bElement of queryResult) {
        setElementsColorToRainbow([td, bElement.parentElement], bElement.textContent);
      }
    }
    /* Month page display mode */
    let tableQuery = "table/tbody/tr[2]/td/table/tbody/tr[position()>1]/td[position()>1]/table[position()>1]";
    for (let table of XPathQuery(tableQuery, divVis)) {
      let queryResult = XPathQuery("tbody/tr/td/text()", table);
      for (let textNode of queryResult) {
        let subjectName = textNode.textContent;
        setElementsColorToRainbow([table], subjectName);
      }
    }
    /* Array page display mode */
    for (let div of document.querySelectorAll("div#DivNom")) { // Yes, this page has several elements with the same id... and this work.
      setElementsColorToRainbow([div.parentElement.parentElement, div], div.textContent);
    }
  }

  features["promethee.emse.fr:rainbow"].action = (me) => {
    rainbowSetter();
  };

  features["promethee.emse.fr:noweekend"].action = (me) => {
    let divVis = document.getElementById("DivVis");
    let monthCheckQuery = "table/tbody/tr[2]/td/table/tbody/tr[2]/td[1]/@class[.='GEDcellsouscategorie' or .='GedCellSousCategorie']";
    if (XPathQuery(monthCheckQuery, divVis).length > 0) {
      return; // We are in week mode or array mode, not month mode.
    }
    let tdQuery = "table/tbody/tr[2]/td/table/tbody/tr/td[position()>6][position()>last()-2]";
    for (let td of XPathQuery(tdQuery, divVis)) {
      td.parentElement.removeChild(td);
    }
  };

  features["promethee.emse.fr:expandShrink"].action = (me) => {
    let classBandeau = "TitreBandeau";
    for (let tdTitreBandeau of document.getElementsByClassName(classBandeau)) {
      if (tdTitreBandeau.textContent.match(/agenda/i)) {
        importCss("/OpDotNet/site/css/default/font-awesome/css/font-awesome.css");
        let trParent = tdTitreBandeau.parentElement;
        let tdIcon = document.createElement("td");
        let aIcon = document.createElement("a");
        aIcon.classList.add("icon"); // Useless
        if (window !== window.top) {
          aIcon.textContent = "";
          aIcon.addEventListener("click", _ => action.topifyFrame(me), true);
          aIcon.href = document.location.href;
        } else {
          aIcon.textContent = "";
          aIcon.href = "https://promethee.emse.fr/OpDotNet/Noyau/Default.aspx";
        }
        aIcon.style.fontFamily = "FontAwesome";
        aIcon.style.marginLeft = ".5em";
        //aIcon.style.cursor = "pointer";
        aIcon.style.color = "#ffffff";
        tdIcon.appendChild(aIcon);
        tdIcon.classList.add(classBandeau);
        trParent.insertBefore(tdIcon, tdTitreBandeau.nextSibling);
      }
    }
  };
}

main();
})();
