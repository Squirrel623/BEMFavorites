// ==UserScript==
// @name       BEMFavorites
// @version    0.7.1
// @author     Squirrel623
// @description  Add a favorites section to Berryemotes
// @match      http://www.berrytube.tv/*
// @match      http://berrytube.tv/*
// @match      https://www.berrytube.tv/*
// @match      https://berrytube.tv/*
// @updateURL  https://squirrel623.github.io/BEMFavorites/bem-favorites.user.js
// ==/UserScript==

// Let's make sure BEM is loaded
var bemfMaxIterations = 200;
var bemfIteration = 0;

var bemfIntervalId = setInterval(function() {
  bemfIteration++;
  if (bemfIteration > bemfMaxIterations) {
    clearInterval(bemfIntervalId);
    console.warn('Berry Emotes not enabled or did not load fast enough. Giving up.');
  }

  if (typeof Bem === 'undefined') {
    return;
  }

  clearInterval(bemfIntervalId);

  // Promise polyfill for those poor souls using IE
  var polyfillScript=document.createElement('script');
  polyfillScript.setAttribute("type","text/javascript");
  polyfillScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js");
  document.head.appendChild(polyfillScript);

  var bemfScript=document.createElement('script');
  bemfScript.setAttribute("type","text/javascript");
  bemfScript.setAttribute("src", "https://squirrel623.github.io/BEMFavorites/dist/bem-favorites.min.js");
  document.head.appendChild(bemfScript);
}, 100);
