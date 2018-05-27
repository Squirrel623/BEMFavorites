// ==UserScript==
// @name       BEMFavorites
// @version    0.1
// @description  Add a favorites section to Berryemotes
// @match      http://www.berrytube.tv/*
// @match      http://berrytube.tv/*
// @updateURL  https://squirrel623.github.io/BEMFavorites/userscript.js
// ==/UserScript==

var script=document.createElement('script');
script.setAttribute("type","text/javascript");
script.setAttribute("src", "https://squirrel623.github.io/BEMFavorites/dist/bem-favorites.min.js");
document.head.appendChild(script);