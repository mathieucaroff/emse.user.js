// ==UserScript==
// @name        EMSE
// @namespace   oxyde.org
// @include     /^https://[a-zA-Z0-9_-]+[.]emse[.]fr/
// @include     /^https://172[.]16[.]160[.]10:5001/
// @author      Mathieu CAROFF
// @version     1.01
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

var debug = true;

// You can disable / enable
var page = {
	// fw-cgcp
	"fw-cgcp.emse.fr:login": {
		title: "Auto login on fw-cgcp.emse.fr",
		description: "Automatically enters credentials on fw-cgcp.emse.fr. Auto send the completed form.",
		enabled: true,
		regex: "^https://fw-cgcp.emse.fr/auth/($|(auth|login).html)"
	},
	"fw-cgcp.emse.fr:confirm": {
		title: "Auto confirm on fw-cgcp.emse.fr",
		description: "Automatically tick the checkbox to say you read the use conditions. The validate.",
		enabled: true,
		regex: "^https://fw-cgcp.emse.fr/auth/plain.html$"
	},
	"fw-cgcp.emse.fr:relog": {
		title: "Auto relog on fw-cgcp.emse.fr",
		description: "Automatically goes from the 'Remaining time' page to the 'Login' page when the elapsed time exceeds `elapsedTimeThreshold`, or the remaining time goes below `remainingTimeThreshold`",
		enabled: true,
		regex: "^https://fw-cgcp.emse.fr/auth/userinfo.html$",
		redirectionDestination: "https://fw-cgcp.emse.fr/auth/auth.html",
		// ALL TIMES ARE EXPRESSED IN SECONDS (NOT MILLISECONDS).
		elapsedTimeThreshold:  60 * ( 60 * 0 + 30 ) + 0,
		remainingTimeThreshold:  60 * ( 60 * 0 + 14 ) + 0
	},

	// Various locations
	"cas.emse.fr:login": {
		title: "Auto login on cas.emse.fr",
		description: "Automatically enters credentials on cas.emse.fr. Auto send the completed form.",
		enabled: true,
		regex: "^https://cas.emse.fr/login"
	},
	"campus.emse.fr:go:login": {
		title: "Auto login on cas.emse.fr",
		description: "Automatically enters credentials on cas.emse.fr. Auto send the completed form.",
		enabled: true,
		regex: "^https://campus.emse.fr/login"
	},
	"CAMPUS CGP:login": {
		title: "Auto login on CAMPUS CGP server",
		description: "Automatically enters credentials on CAMPUS CGP server. Auto send the completed form.",
		enabled: true,
		regex: "^https://172.16.160.10:5001"
	},

	// sogo
	"sogo.emse.fr:login": {
		title: "Auto login on sogo.emse.fr",
		description: "Automatically enters credentials on sogo.emse.fr. Auto send the completed form.",
		enabled: true,
		regex: "^https://sogo.emse.fr/(SOGo|login)"
	},
	"sogo3.emse.fr:login": {
		title: "Auto login on sogo3.emse.fr",
		description: "Automatically enters credentials on sogo3.emse.fr. Auto send the completed form.",
		enabled: true,
		regex: "^https://sogo3.emse.fr/(SOGo|login)"
	},

	// promethee
	"promethee.emse.fr:defaultTab:agenda": {
		title: "",
		description: "Automatically select the agenda tab on promethee.emse.fr.",
		enabled: true,
		regex: "^https://promethee.emse.fr/OpDotNet/Eplug/Portail/PortailDefault.aspx?intIdGroupe=31"
	},
	"promethee.emse.fr:errorLostSessionRedirection": {
		title: "",
		description: "Attempt to reload the session when it is lost",
		enabled: true,
		regex: "DISABLED^https://promethee.emse.fr/OpDotNet/Noyau/Default.aspx",
		redirectionDestination: "https://cas.emse.fr/login?service=https://promethee.emse.fr/opdotnet/"
	},
	"promethee.emse.fr:errorRedirection": {
		title: "Promethee error page redirection",
		description: "Add redirection from this error page",
		enabled: true,
		regex: "^https://promethee.emse.fr/OpDotNet/Commun/OPErreur.aspx",
		redirectionDestination: "https://portail.emse.fr"
	},
	"promethee.emse.fr:logoffRedirection": {
		title: "Promethee logoff page redirection",
		description: "Add redirection from `logoff` page",
		enabled: true,
		regex: "^https://promethee.emse.fr/OpDotNet/Noyau/Login.aspx?&cmd=logoff"
	}
};


//////////////////////////
// The code begins here //
//////////////////////////
////// Handy functions //////
function nothing () {}

//////  Other things  //////
var log = debug ? console.log : nothing;

function urlmatch (me) {
	let regstr = me.regex.replace(/([^%])([.?+])|(%)%/g, '$1[$2$3]');
  return location.href.match(new RegExp(regstr));
}

function main () {
	for (let name in page) {
		let me = page[name];
		if (urlmatch(me)) {
			log(me.title);
			me.action(me);
		}
	}
}

function applyRedirection (me) {
	window.top.location.assign(me.redirectionDestination);
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

function readInputById (id) {		
	let input = document.getElementById(id);		
	return input ? input.value : null;		
}

function fillInputById (id, value) {
	let input = document.getElementById(id);
	if (input) {
		input.value = value;
	}
	return !!input;
}

function simpleSubmit (inputid) {
	let input = document.getElementById(inputid);
	if (input) {
		input.form.submit();
	}
	return !!input;
}

function getSimpleSubmiter (inputid) {
	function simpleSubmiter (me) {
		return simpleSubmit(inputid);
	}
	return simpleSubmiter;
}

function autoLogin (inputids, submitter) { // private
	var success = true;
	if (global.fillUsernameEnabled) {
		success &= fillInputById(inputids.username, global.username);
	}
	if (global.fillPasswordEnabled) {
		success &= fillInputById(inputids.password, global.password);
	}
	if (global.autosubmit && readInputById(inputids.username) && readInputById(inputids.password)) {
		success &= submitter();
	}
	return success;
}

function getAutoLogger (inputids, submitter) { // public
	function autoLogger (me) {
		return autoLogin(inputids, submitter);
	}
	return autoLogger;
}

function getSimpleAutoLogger (inputids) { // public
	return getAutoLogger(inputids, getSimpleSubmiter(inputids.username));
}


////// Per-address Code //////
page["fw-cgcp.emse.fr:login"].action = (me) => {
	var inputids = {
		username: "",
		password: "pswd"
	};
	if (document.getElementById("n_uid")) inputids.username = "n_uid";
	else if (document.getElementById("uid")) inputids.username = "uid";
	getSimpleAutoLogger(inputids)();
};

page["fw-cgcp.emse.fr:confirm"].action = (me) => {
  var btn = document.getElementById("accept_btn");
  if (btn) {
		var tickbox = btn.form.querySelector("input[name=read]");
		window.setTimeout(_ => tickbox.click(), 400);
		window.setTimeout(_ => btn.click(), 1000);
	}
};
page["fw-cgcp.emse.fr:relog"].action = (me) => {
	var loadNextPage = function () {
		applyRedirection(me);
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
    box.innerHTML += `
<br/>You will be relogged whenever the elapsed time exceeds ${formatTime(me.elapsedTimeThreshold)}, or the remaining time goes below ${formatTime(me.remainingTimeThreshold)}.
<br/>This will happend in ${formatTime(relogTime)}.`;
};


page["cas.emse.fr:login"].action = getSimpleAutoLogger({
	username: "username",
	password: "password"
});

page["campus.emse.fr:go:login"].action = (me) => {
	document.querySelector(".alert a").click();
};

page["CAMPUS CGP:login"].action = (me) => {
	function getWaitButton () {
		let waitAttempts = 6;
		function waitButton () {
			if (--waitAttempts < 0) {
				return;
			} else if (document.getElementById("login-btn")) {
				document.getElementById("login-btn").click();
			} else {
				setTimeout(waitButton, 80);
			}
		}
		return waitButton;
	}
	getAutoLogger({
		username: "login_username",
		password: "login_passwd"
	}, getWaitButton())();
};

page["sogo.emse.fr:login"].action = getAutoLogger({
	username: "userName",
	password: "password"
},
_ => window.setTimeout(_ => document.getElementById("submit").click(), 0)
);

page["sogo3.emse.fr:login"].action = (me) => {
	let waiter = waiterForAtMostEveryThen(
		_ => {
			return document.getElementById("input_1");
		},
		8,
		1400,
		_ => {
			getAutoLogger({
				username: "input_1",
				password: "input_2"
			}, nothing)();

			let buttons = document.getElementsByClassName("md-fab");
			if (buttons && global.autosubmit) {
				buttons[0].click();
			}
		}
	);
	waiter();
};

page["promethee.emse.fr:defaultTab:agenda"].action = (me) => {
	document.getElementById("lnk1").click();
};
page["promethee.emse.fr:errorLostSessionRedirection"].action = applyRedirection;
page["promethee.emse.fr:errorRedirection"].action = applyRedirection;
page["promethee.emse.fr:logoffRedirection"].action = applyRedirection;


main();
