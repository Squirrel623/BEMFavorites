// Copy and paste this into a snippet in chrome, and run that snippet once.
// In conjunction with the VS Code "Live Server" extension, this will allow
// you to test the code by building and then running "removeBemf()" and then
// "addBemf()" in the console.

function addBemf() {
  var bemScript=document.createElement('script');
  bemScript.setAttribute("class", "bem-favs");
  bemScript.setAttribute("type","text/javascript");
  bemScript.setAttribute("src", "http://127.0.0.1:5500/dist/bundle.js");
  document.head.appendChild(bemScript);
}

function removeBemf() {
  $(document.head).find('.bem-favs').remove();
  BEMFavorites.dispose();
}
