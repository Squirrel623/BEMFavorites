// ==UserScript==
// @name       BEMFavorites
// @version    0.4
// @author     Squirrel623
// @description  Add a favorites section to Berryemotes
// @match      http://www.berrytube.tv/*
// @match      http://berrytube.tv/*
// @updateURL  https://squirrel623.github.io/BEMFavorites/bem-favorites.user.js
// ==/UserScript==

// The script we are trying to load uses webpack that shims out Bem. It needs the global
// Bem object to be created before the script it actually loaded
var bemfMaxIterations = 200;
var bemfIteration = 0;

var bemfIntervalId = setInterval(function() {
  bemfIteration++;
  if (bemfIteration > bemfMaxIterations) {
    clearInterval(bemfIntervalId);
    console.warn('Berry Emotes not enabled or did not load fast enough. Giving up.');
  }

  if (Bem === undefined) {
    return;
  }

  clearInterval(bemfIntervalId);
  var bemfScript=document.createElement('script');
  bemfScript.setAttribute("type","text/javascript");
  bemfScript.setAttribute("src", "https://squirrel623.github.io/BEMFavorites/dist/bem-favorites.min.js");
  document.head.appendChild(bemfScript);
}, 100);
