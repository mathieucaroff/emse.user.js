// ==UserScript==
// @name        EMSE
// @namespace   oxyde.org
// @include     /^https://[a-zA-Z0-9_-]+[.]emse[.]fr/
// @include     /^https://172[.]16[.]160[.]10:5001/
// @include     /^https?://securelogin[.]arubanetworks[.]com/
// @author      Mathieu CAROFF
// @version     1.02
// @grant       none
// @run-at      document-end
// ==/UserScript==


//////////////////////////
//    Configuration     //
//////////////////////////

var global = {};

global.fillUsernameEnabled = false;
global.username = "YOUR.LOGIN";

global.fillPasswordEnabled = false;
global.password = "YOUR.PASSWORD";

global.autosubmit = true;

global.prometheeColorsEnabled = true;

// You can disable / enable
var features_ = _ => ({
  // fw-cgcp
  "fw-cgcp.emse.fr:login": {
    title: "Auto login on fw-cgcp.emse.fr",
    description: "Automatically enters credentials on fw-cgcp.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: FILL_SUBMIT * MOZILLA + BROWSERFILL_SUBMIT * MOZILLA,
    regex: "^https://fw-cgcp.emse.fr/auth/($|login.html)",
    action: action.fillAndSubmitForm,
    usernameInputId: "uid",
    passwordInputId: null,
  },
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
  "fw-cgcp.emse.fr:confirm": {
    title: "Auto confirm on fw-cgcp.emse.fr",
    description: "Automatically tick the checkbox to say you read the use conditions. The validate.",
    enabled: true,
    tested: MOZILLA + CHROME,
    regex: "^https://fw-cgcp.emse.fr/auth/plain.html$",
    action: specifiedLater
  },
  "fw-cgcp.emse.fr:relog": {
    title: "Auto relog on fw-cgcp.emse.fr",
    description: "Automatically goes from the 'Remaining time' page to the 'Login' page when the elapsed time exceeds `elapsedTimeThreshold`, or the remaining time goes below `remainingTimeThreshold`",
    enabled: true,
    tested: MOZILLA * 2 + CHROME,
    regex: "^https://fw-cgcp.emse.fr/auth/userinfo.html$",
    redirectionDestination: "https://fw-cgcp.emse.fr/auth/auth.html",
    // ALL TIMES ARE EXPRESSED IN SECONDS (NOT MILLISECONDS).
    elapsedTimeThreshold:  60 * ( 60 * 0 + 30 ) + 0,
    remainingTimeThreshold:  60 * ( 60 * 0 + 14 ) + 0,
    action: specifiedLater
  },

  // Schools wifi login pages:
  // securelogin.arubanetworks.com for eduspot and INVITE wifi networks
  "securelogin.arubanetworks.com:login": {
    title: "Auto login on some of the school wifi networks",
    description: "Automatically enters credentials on securelogin.arubanetworks.com. Auto send the completed form.",
    enabled: true,
    tested: FILL_SUBMIT * MOZILLA, 
    regex: "^https%?://securelogin.arubanetworks.com/cgi-bin/login",
    action: action.fillAndSubmitForm,
    usernameInputId: "user",
    passwordInputId: "password"
  },

  // Various locations
  "cas.emse.fr:login": {
    title: "Auto login on cas.emse.fr",
    description: "Automatically enters credentials on cas.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: ( FILL_SUBMIT + BROWSERFILL_SUBMIT + FILL_NOSUBMIT ) * MOZILLA + FILL_SUBMIT * CHROME,
    regex: "^https://cas.emse.fr/login",
    action: action.fillAndSubmitForm,
    usernameInputId: "username",
    passwordInputId: "password"
  },
  "campus.emse.fr:go:login": {
    title: "Auto select the CAS login link on campus.emse.fr login page.",
    description: "Automatically redirects you from the (deceiving) campus login page to the cas login page.",
    enabled: true,
    tested: MOZILLA + CHROME,
    regex: "^https://campus.emse.fr/login",
    action: formtools.elementClicker(".alert a")
  },
  "CAMPUS GCP:login": {
    title: "Auto login on CAMPUS GCP server",
    description: "Automatically enters credentials on CAMPUS GCP server. Auto send the completed form.",
    enabled: true,
    tested: FILL_SUBMIT * MOZILLA + FILL_SUBMIT * CHROME + BROWSERFILL_SUBMIT * MOZILLA,
    regex: "^https://(cloud-sgc.emse.fr|172.16.160.10):5001",
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
    tested: FILL_SUBMIT * MOZILLA + FILL_SUBMIT * CHROME, // Couldn't test BROSERFILL_SUBMIT, your help is welcomed =)
    regex: "^https://sogo.emse.fr/(SOGo|login)",
    action: action.fillAndSpecialSubmitForm,
    usernameInputId: "userName",
    passwordInputId: "password",
    specialSubmit: formtools.elementClicker("#submit")
  },
  "sogo3.emse.fr:login": {
    title: "Auto login on sogo3.emse.fr",
    description: "Automatically enters credentials on sogo3.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: BROWSERFILL_SUBMIT * MOZILLA + FAILED(FILL_SUBMIT * MOZILLA) + FAILED(FILL_SUBMIT * CHROME),
    regex: "^https://sogo3.emse.fr/(SOGo|login)",
    action: action.fillAndSpecialSubmitForm,
    usernameInputId: "input_1",
    passwordInputId: "input_2",
    specialSubmit: formtools.elementClicker(".md-fab")
  },
  // promethee
  "promethee.emse.fr:rainbow": {
    title: "Add color to the agenda subjects",
    description: "Hash the name of each subject of the agenda into a color",
    enabled: global.prometheeColorsEnabled && true,
    tested: MOZILLA + CHROME,
    regex: "^https://promethee.emse.fr/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp",
    action: specifiedLater
  },
  "promethee.emse.fr:defaultTab:agenda": {
    title: "",
    description: "Automatically select the agenda tab on promethee.emse.fr.",
    enabled: true,
    tested: MOZILLA + CHROME,
    regex: "^https://promethee.emse.fr/OpDotNet/Eplug/Portail/PortailDefault.aspx?intIdGroupe=31",
    action: (me) => document.getElementById("lnk1").click()
  },
  "promethee.emse.fr:errorRedirection": {
    title: "Promethee error page redirection",
    description: "Add redirection from error pages",
    enabled: true,
    tested: MOZILLA + CHROME,
    regex: "^https://promethee.emse.fr/(commun/erreur.asp?code=[0-9]%+|OpDotNet/Commun/OPErreur.aspx?errCode=[0-9]%+)",
    redirectionDestination: "https://cas.emse.fr/login?service=https://promethee.emse.fr/opdotnet/",
    action: (me) => {
      log("starting");
      action.applyRedirection(me);
    }
  },
  "promethee.emse.fr:logoffRedirection": {
    title: "Promethee logoff page redirection",
    description: "Add redirection from `logoff` page",
    enabled: false,
    tested: DISABLED,
    regex: "DISABLED^https://promethee.emse.fr/OpDotNet/Noyau/Login.aspx?&cmd=logoff",
    redirectionDestination: "https://portail.emse.fr/",
    action: action.applyRedirection
  }
});


// testFlags [
var UNTESTED = 0;
var DISABLED = 0;
var FAILED = (...args) => null;
var TESTED = 1;

var NOFILL_NOSUBMIT = 1;
var BROWSERFILL_SUBMIT = 1;
var FILL_NOSUBMIT = 1;
var FILL_SUBMIT = 1;

var MOZILLA = 1;
var CHROME = 1;
// ] testFlags

function nothing (...args) {}

var debug = false;
var specifiedLater = "specifiedLater";
var log = debug ? console.log : nothing;
var regexlog = nothing;
var matchlog = log;

function main () {
  var features = features_();
  laterSpecifiedActions(features);
  for (let name in features) {
    let me = features[name];
    if (me.enabled && urlmatch(me)) {
      matchlog("MATCH:", me.title);
      me.action(me);
    }
  }
}

function urlmatch (me) {
  regexlog("RAW reg:", me.regex);
  let regstr = me.regex.replace(/([^%])([.?+])/g, "$1[$2]").replace(/%([%.?+])/g, '$1');
  regexlog("CPL reg:", regstr);
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
};

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

function waiterForAtMostEveryThen (testFun, attempts, millisecs, callback) {
  function waiter () {
    if (attempts-- <= 0) return;
    else if (testFun()) callback();
    else setTimeout(waiter, millisecs);
  }
  return waiter;
}

function launch (func) {
  function schedule_func () {
    for (let t in [0, 100, 200, 300, 500, 1000, 1500]) {
      setTimeout(func, t);
    }
  }
  schedule_func();
  document.body.addEventListener("load", schedule_func, true);
  func();
}

function launcher (func) {
  return _ => launch(func)
}

var action = {};

action.applyRedirection = function (me) {
  window.top.location.assign(me.redirectionDestination);
}

action.fillAndSubmitForm = function (me) {
  launch(_ => {
    formtools.fill(me);
    formtools.submit(me);
  });
}

action.fillAndSpecialSubmitForm = function (me) {
  launch(_ => {
    formtools.fill(me);
    if (global.autosubmit) {
      me.specialSubmit();
    }
  });
}

formtools = {};
formtools.readInputById = function (id) {    
  let input = document.getElementById(id);    
  return input ? input.value : null;    
};
formtools.fillInputById = function (id, value) {
  let input = document.getElementById(id);
  if (input) {
    console.log("filling input", input)
    input.value = value;
  }
  return !!input;
};
formtools.fill = function (me) {
  uiid = me.usernameInputId;
  piid = me.passwordInputId;
  if (global.fillUsernameEnabled) {
    formtools.fillInputById(uiid, global.username);
  }
  if (global.fillPasswordEnabled) {
    formtools.fillInputById(piid, global.password);
  }
};
formtools.submit = function (me) {
  uiid = me.usernameInputId;
  piid = me.passwordInputId;
  if (global.autosubmit) {
    if ( ((uiid === null) || formtools.readInputById(uiid)) && ((piid === null) || formtools.readInputById(piid)) ) {
      for (let inputid of [uiid, piid]) {
        let input = document.getElementById(inputid);
        if (input) {
          input.form.submit();
        }
      }
    }
  }
};
formtools.elementClicker = function (selector) {
  return _ => {
    let element = document.querySelector(selector);
    element && element.click();
  }
};


/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


function laterSpecifiedActions (features) {
  features["fw-cgcp.emse.fr:confirm"].action = (me) => {
    var btn = document.getElementById("accept_btn");
    if (btn) {
      var tickbox = btn.form.querySelector("input[name=read]");
      setTimeout(_ => tickbox.click(), 400);
      setTimeout(_ => btn.click(), 1000);
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
    if (box.textContent.indexOf("Welcome") != -1) {
      box.innerHTML += `
  <br/>You will be relogged whenever the elapsed time exceeds ${formatTime(me.elapsedTimeThreshold)}, or the remaining time goes below ${formatTime(me.remainingTimeThreshold)}.
  <br/>This will happend in ${formatTime(relogTime)}.`;
    }
  };

  function rainbow_extractSubjectTitle (cell) {
    let title = "";
    let elems = cell.getElementsByTagName("b");
    if (elems.length > 0) {
      title = elems[0].textContent || "";
    }
    return title;
  }

  features["promethee.emse.fr:rainbow"].action = (me) => {
    function colorSetter () {
      tdcelllist = document.getElementsByClassName("GEDcellsouscategorie"); // Subject
      for (let cell of tdcelllist) {
        let subjectTitle = rainbow_extractSubjectTitle(cell);
        if (subjectTitle) {
          let hash = hashString(normalizeString(subjectTitle));
          cell.setAttribute("bgcolor", genColorFromHash(hash)); // me.palette[colorId]
        }
      }
    }
    colorSetter();
    setTimeout(_ => colorSetter, 0); // Apparently useless
  };
}

main();
