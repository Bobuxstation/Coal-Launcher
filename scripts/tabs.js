window.addEventListener("DOMContentLoaded", () => {
    const tabs = document.querySelectorAll('[role="tab"]');
    const tabList = document.querySelector('[role="tablist"]');

    // Add a click event handler to each tab
    tabs.forEach((tab) => {
        tab.addEventListener("click", changeTabs);
    });

    // Enable arrow navigation between tabs in the tab list
    let tabFocus = 0;

    tabList.addEventListener("keydown", (e) => {
        // Move right
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            tabs[tabFocus].setAttribute("tabindex", -1);
            if (e.key === "ArrowRight") {
                tabFocus++;
                // If we're at the end, go to the start
                if (tabFocus >= tabs.length) {
                    tabFocus = 0;
                }
                // Move left
            } else if (e.key === "ArrowLeft") {
                tabFocus--;
                // If we're at the start, move to the end
                if (tabFocus < 0) {
                    tabFocus = tabs.length - 1;
                }
            }

            tabs[tabFocus].setAttribute("tabindex", 0);
            tabs[tabFocus].focus();
        }
    });
});

function changeTabs(e) {
    document.getElementById("taskNavBtn").style.display = "none";
    document.getElementById("downloadsNavBtn").style.display = "none";
    document.getElementById("taskmgr").style.display = "none";
    document.getElementById("downloads").style.display = "none";
    document.getElementById("taskNavBtn").ariaSelected = "false";
    document.getElementById("downloadsNavBtn").ariaSelected = "false";

    let clickSound = new Audio("assets/click_002.ogg")
    clickSound.volume = 0.1;
    clickSound.play()

    document.getElementById("pagetitle").innerText = (e.target.querySelector("span").innerHTML + " - Coal Launcher");
    const target = e.target;
    const parent = target.parentNode;
    const grandparent = parent.parentNode;

    if (target.getAttribute("aria-controls") == "collections") {
        document.getElementById("taskNavBtn").style.display = "block";
        document.getElementById("refreshNavBtn").style.display = "none";
    } else if (target.getAttribute("aria-controls") == "market") {
        document.getElementById("downloadsNavBtn").style.display = "block";
        document.getElementById("refreshNavBtn").style.display = "none";
    } else if (target.getAttribute("aria-controls") == "options") {
        document.getElementById("refreshNavBtn").style.display = "none";
    }

    // Remove all current selected tabs
    parent
        .querySelectorAll('[aria-selected="true"]')
        .forEach((t) => t.setAttribute("aria-selected", false));

    // Set this tab as selected
    target.setAttribute("aria-selected", true);

    // Hide all tab panels
    grandparent
        .querySelectorAll('[role="tabpanel"]')
        .forEach((p) => p.setAttribute("hidden", true));

    // Show the selected panel
    grandparent.parentNode
        .querySelector(`#${target.getAttribute("aria-controls")}`)
        .removeAttribute("hidden");

    document.getElementById('body').style.backgroundImage = "";

    if (e.target.id == "collectionbtn") {
        document.getElementById('body').style.backgroundImage = "url('" + lastGameBackground + "')";
    } else if (e.target.id == "detailbtn") {
        document.getElementById('body').style.backgroundImage = "url('" + lastDownloadsBackground + "')";
    }
}

let tabList = require(configDir + '/extensions.json');
let header = document.getElementById("header")
tabList.extensions.forEach(element => {
    let btn = document.createElement("a");
    btn.className = "navbtn";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-controls", element.name);

    btn.innerHTML = `
        <i class="${element.icon}"></i>
        <span>${element.name}</span>
    `

    btn.onclick = function () {
        document.getElementById("refreshNavBtn").style.display = "block";

        document.getElementById("refreshNavBtn").onclick = function () {
            webview.reload();
        }
    }

    header.prepend(btn);

    let tab = document.createElement("div");
    tab.className = "content body";
    tab.setAttribute("role", "tabpanel");
    tab.setAttribute("hidden", "true");
    tab.setAttribute("id", element.name);

    let webview = document.createElement("webview");
    webview.setAttribute("src", element.URL);
    webview.style.height = "calc(100vh - 45px)"

    tab.appendChild(webview);

    document.getElementById('body').appendChild(tab);
});