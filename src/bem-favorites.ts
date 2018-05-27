import $ from 'jquery';
import Bem from 'bem';
import find from 'lodash-es/find';
import filter from 'lodash-es/filter';
import forEach from 'lodash-es/forEach';

import { FavoritesStore } from './favorites-store';
import { createSingleButtonContextMenu } from './util';
import { createFavoritesDialog } from './bem-favorites-dialog';

let favoritesStore: FavoritesStore;

export function StartBemFavorites() {
  favoritesStore = new FavoritesStore();
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    observer.disconnect();
  };
}

const observer = new MutationObserver((mutations) => {
  const bemDialogAddMutation = find(mutations, (mutation: MutationRecord) => {
    return mutation.type === 'childList' &&
      mutation.addedNodes.length === 1 &&
      (mutation.addedNodes[0] as HTMLElement).className === 'berrymotes_search_results';
  });

  const bemDialogEmoteMutations = filter(mutations, (mutation: MutationRecord) => {
    return mutation.type === 'childList' &&
      mutation.addedNodes.length === 1 &&
      (mutation.target as HTMLElement).className === 'berrymotes_search_results' &&
      mutation.addedNodes[0].childNodes.length === 1 &&
      (mutation.addedNodes[0].childNodes[0] as HTMLElement).className === 'berryemote';
  });

  if (bemDialogAddMutation !== undefined) {
    onBerryEmotesDialogOpened();
  }

  if (bemDialogEmoteMutations.length > 0) {
    onBerryEmotesResultsPopulated(bemDialogEmoteMutations);
  }
});

function onBerryEmotesDialogOpened() {
  modifyBemSearchInput();
  addFavsLink();
}

function onBerryEmotesResultsPopulated(mutations: MutationRecord[]) {
  forEach(mutations, (mutation) => {
    const emoteElement = (mutation.addedNodes[0].childNodes[0] as HTMLElement);
    const possibleEmoteId = emoteElement.getAttribute('emote_id');

    if (possibleEmoteId === null) {
      return;
    }
    const emoteId = parseInt(possibleEmoteId, 10);

    $(emoteElement).contextmenu((event) => {
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
