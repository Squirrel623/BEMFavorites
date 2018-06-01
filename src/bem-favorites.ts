import { FavoritesStore } from './favorites-store';
import { createSingleButtonContextMenu } from './util';
import { createFavoritesDialog } from './bem-favorites-dialog';
import { forEach } from './my-lodash';

let favoritesStore: FavoritesStore;

export function StartBemFavorites() {
  favoritesStore = new FavoritesStore();

  const originalShowBerrymoteSearch = Bem.showBerrymoteSearch;

  // tslint:disable-next-line:only-arrow-functions
  Bem.showBerrymoteSearch = function() {
    originalShowBerrymoteSearch.apply(this, arguments);
    onBerryEmotesDialogOpened();
  };

  return () => {
    Bem.showBerrymoteSearch = originalShowBerrymoteSearch;
  };
}

function onBerryEmotesDialogOpened() {
  modifyBemSearchInput();
  addFavsLink();
  hijackBemEmoteContextMenu();
}

function hijackBemEmoteContextMenu() {
  const bemResultsElement = getBemDialog().find('.berrymotes_search_results');

  bemResultsElement.on('contextmenu', '.berryemote', (event) => {
    const $emote = $(event.target);
    const emoteId = parseInt($emote.attr('emote_id'), 10);

    const onClick = () => {
      favoritesStore.addEmote(emoteId);

      return true;
    };

    createSingleButtonContextMenu({
      uid: 'bemAddFavorite',
      top: event.pageY,
      left: event.pageX,
      text: 'Add To Favorites',
      onClick,
    });

    return false;
  });
}

function getBemDialog() {
  const dialog = $('body').find('.berrymotes .dialogContent');
  if (dialog.length !== 1) {
    throw new Error('No BEM dialog found');
  }

  return dialog;
}

function modifyBemSearchInput() {
  const searchInput = $('body').find('.berrymotes_search');
  if (searchInput.length !== 1) {
    throw new Error('No BEM input found');
  }

  searchInput.width(250);
}

function addFavsLink() {
  const settingsLink = getBemDialog().find('div:contains("Settings")');
  if (settingsLink.length !== 1) {
    throw new Error('Settings link not found');
  }

  $('<div/>')
    .text('Favs')
    .css({
      float: 'right',
      cursor: 'pointer',
      'text-decoration': 'underline',
      'margin-right': '5px'
    })
    .click(() => createFavoritesDialog(favoritesStore))
    .insertAfter(settingsLink);
}
