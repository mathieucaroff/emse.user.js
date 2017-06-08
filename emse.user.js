// ==UserScript==
// @name        EMSE
// @namespace   oxyde.org
// @include     /^https?://[a-zA-Z0-9_-]+[.]emse[.]fr/
// @include     /^https?://172[.]16[.]160[.]10:5001/
// @include     /^https?://securelogin[.]arubanetworks[.]com/
// @author      Mathieu CAROFF
// @version     1.03
// @grant       none
// @run-at      document-end
// ==/UserScript==
(_ => {

//////////////////////////
//    Configuration     //
//////////////////////////

var global = {};

global.username = "YOUR.LOGIN";
global.fillUsernameEnabled = true;
// global.fillUsernameEnabled overwritten to false if login set to "" or to "YOUR.LOGIN"

global.password = "YOUR.PASSWORD";
global.fillPasswordEnabled = true;
// global.fillPasswordEnabled overwritten to false if password set to "" or to "YOUR.PASSWORD"

global.autosubmit = true;

global.prometheeColorsEnabled = true;
global.prometheeMonthRemoveWeekEnd = true;

global.campusAutologin = true;


global.fillUsernameEnabled &= !(global.userename == "" || global.username === "YOUR.LOGIN");
global.fillPasswordEnabled &= !(global.password == "" || global.password === "YOUR.PASSWORD");

// You can disable / enable each feature separately
var features_ = _ => ({
  // | Promethee |
  "promethee.emse.fr:rainbow": {
    title: "Add color to the agenda subjects",
    description: "Hash the name of each subject of the agenda into a color. Set that color as background of the subject block. Works in all calendar viewing modes: weekly, monthly and array. Elements are selected using XPath or querySelectorAll.",
    enabled: global.prometheeColorsEnabled && true,
    tested: MOZILLA + CHROME,
    regex: "^https://promethee.emse.fr/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp",
    action: specifiedLater
  },
  "promethee.emse.fr:noweekend": {
    title: "Remove week-ends on monthly calendar",
    description: "Use XPath to select elements corresponding to Saturday or Sunday. Delete them from the view.",
    enabled: global.prometheeMonthRemoveWeekEnd && true,
    tested: MOZILLA + CHROME,
    regex: "^https://promethee.emse.fr/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp",
    action: specifiedLater
  },
  "promethee.emse.fr:expandShrink": {
    title: "Add expand and shrink buttons to the agenda frame.",
    description: "The expand is a link to the url of it's frame. The shrink button is a link to promethee.emse.fr.",
    enabled: global.prometheeColorsEnabled && true,
    tested: MOZILLA + CHROME,
    regex: "^https://promethee.emse.fr/(OpDotnet/commun/Login/aspxtoasp.aspx?url=/)%?Eplug/Agenda/Agenda.asp",
    action: specifiedLater
  },
  "promethee.emse.fr:defaultTab:agenda": {
    title: "Agenda tab as default",
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

  // | fw-cgcp |
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

  // | Campus |
  "campus.emse.fr:fold": {
    title: "Fold ICM category on campus.emse.fr",
    description: "Folds the ICM category by default on campus.emse.fr.",
    enabled: true,
    tested: MOZILLA + CHROME,
    regex: "^https%?://campus.emse.fr",
    action: specifiedLater
  },
  "campus.emse.fr:autologin": {
    title: "Loads the login page when you aren't logged.",
    description: "Automatically redirect you to the cas login page when you aren't logged on campus.emse.fr.",
    enabled: global.campusAutologin && true,
    tested: MOZILLA + CHROME,
    regex: "^https%?://campus.emse.fr",
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
    tested: MOZILLA + CHROME,
    regex: "^https%?://campus.emse.fr",
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
    tested: MOZILLA + CHROME,
    regex: "^https%?://campus.emse.fr/login",
    action: formtools.elementClicker(".alert a")
  },

  // Cas
  "cas.emse.fr:login": {
    title: "Auto login on cas.emse.fr",
    description: "Automatically enters credentials on cas.emse.fr. Auto send the completed form.",
    enabled: true,
    tested: ( FILL_SUBMIT + BROWSERFILL_SUBMIT + FILL_NOSUBMIT ) * MOZILLA + FILL_SUBMIT * CHROME,
    regex: "^https%?://cas.emse.fr/login",
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
    tested: FILL_SUBMIT * MOZILLA,
    regex: "^https%?://securelogin.arubanetworks.com/cgi-bin/login",
    action: action.fillAndSubmitForm,
    usernameInputId: "user",
    passwordInputId: "password"
  },

  // Campus GCP
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

var IN_DEVELOPMENT = -1;

// ] testFlags

function nothing (...args) {}

var debug = true;
var specifiedLater = "specifiedLater";
var log = debug ? console.log : nothing;
var regexlog = nothing;
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
    if (me.enabled && urlmatch(me)) {
      matchlog("MATCH:", me.title);
      try {
        me.action(me);
      } catch (err) {}
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

formtools = {};
formtools.readInputById = function (id) {
  let input = document.getElementById(id);
  return input ? input.value : null;
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
    if ( ((uiid === null) || formtools.readInputById(uiid))
      && ((piid === null) || formtools.readInputById(piid) || formtools.testFilledByWebkit(piid)) ) {
      submitlog("Auto submitting in formtools.submit", uiid, piid);
      for (let inputid of [uiid, piid]) {
        let input = document.getElementById(inputid);
        submitlog("Found input,", input, "in formtools.submit");
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
    if (element) {
      element.click();
    }
  };
};

formtools.testFilledByWebkit = function (id) {
  let input = document.getElementById(id);
  let filled = false;
  if (input){
    let colorText = window.getComputedStyle(input)["background-color"];
    if  (colorText.indexOf("rgb(250, 255, 189)") != -1
      || colorText.indexOf("#faffbd")            != -1) {
      filled = true;
    }
  }
  return filled;
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
      let queryResult = XPathQuery("table/tbody/tr/td/b[following-sibling::br]", td);
      for (let bElement of queryResult) {
        setElementsColorToRainbow([td, bElement.parentElement], bElement.textContent);
      }
    }
    /* Month page display mode */
    let tableQuery = "table/tbody/tr[2]/td/table/tbody/tr[position()>1]/td[position()>1]/table[position()>1]";
    for (let table of XPathQuery(tableQuery, divVis)) {
      let queryResult = XPathQuery("tbody/tr/td/text()[following-sibling::br]", table);
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
