// ==UserScript==
// @name         jpdb.io with KanjiVG
// @description  Use KanjiVG images instead of jpdb.io ones
// @match        https://jpdb.io/*
// @license      MIT
// @grant        GM_xmlhttpRequest
// @version      0.0.3
// @namespace https://greasyfork.org/users/1309172
// ==/UserScript==
 
function getKanjiUnicodeHex(kanjiElement) {
    const hrefValue = kanjiElement.getAttribute('href');
    const kanjiChar = hrefValue.split("/")[2][0];
    return kanjiChar.charCodeAt(0).toString(16).toLowerCase().padStart(5, '0');
}
 
function replaceKanji() {
    "use strict"
 
    const kanjiElement = document.querySelector('a.kanji.plain');
    if (!kanjiElement) {
        return;
    }
 
    kanjiElement.hidden = true;
 
    const kanjiUnicodeHex = getKanjiUnicodeHex(kanjiElement);
    const url = `https://raw.githubusercontent.com/KanjiVG/kanjivg/master/kanji/${kanjiUnicodeHex}.svg`;
 
    GM_xmlhttpRequest({
        method: "GET",
        url: url,
        onload: function (response) {
            if (response.status != 200) {
                kanjiElement.hidden = false;
                console.log(`KanjiVG: ${xhr.status}: ${xhr.statusText}`);
                return;
            }
 
            const newSVG = response.responseXML.getElementsByTagName("svg")[0];
            newSVG.style.width = "300px";
            newSVG.style.height = "300px";
 
            const strokeNumbers = newSVG.getElementById(`kvg:StrokeNumbers_${kanjiUnicodeHex}`);
            strokeNumbers.style.fontSize = "6px";
 
            // if dark theme
            if (document.firstElementChild.classList.contains("dark-mode")) {
                newSVG.getElementById(`kvg:StrokePaths_${kanjiUnicodeHex}`).style.stroke = "#aaaaaa";
                strokeNumbers.style.fill = "#666666";
            }
            kanjiElement.hidden = false;
            kanjiElement.firstChild.replaceWith(newSVG);
        }
    });
}
 
replaceKanji();
 
let observer = new MutationObserver(() => {
    replaceKanji();
    observer.disconnect();
});
 
observer.observe(document.body, {
     childList: true,
     subtree: true,
});
