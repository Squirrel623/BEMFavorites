// ==UserScript==
// @name       BEMFavorites
// @version    0.1
// @author     Squirrel623
// @description  Add a favorites section to Berryemotes
// @match      http://www.berrytube.tv/*
// @match      http://berrytube.tv/*
// @updateURL  https://github.com/Squirrel623/BEMFavorites/raw/master/bem-favorites.user.js
// ==/UserScript==

var script=document.createElement('script');
script.setAttribute("type","text/javascript");
script.setAttribute("src", "https://github.com/Squirrel623/BEMFavorites/raw/master/dist/bem-favorites.min.js");
document.head.appendChild(script);
