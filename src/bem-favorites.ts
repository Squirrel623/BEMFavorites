import $ from 'jquery';
import Bem from 'bem';
import find from 'lodash-es/find';
import filter from 'lodash-es/filter';
import includes from 'lodash-es/includes';
import remove from 'lodash-es/remove';
import forEach from 'lodash-es/foreach';

import { FavoritesStore } from './favorites-store';
import { createSingleButtonContextMenu, bemInitPromise } from './util';

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
    console.log('BEM Opened');
    modifyBemSearchInput();
    addFavsLink();
  }

  forEach(bemDialogEmoteMutations, (mutation) => {
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
});

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
    .click(openFavsDialog)
    .insertAfter(settingsLink);
}

function openFavsDialog() {
  const favsDialogContent = $('body').dialogWindow({
    title: 'BerryEmote Favorites',
    uid: 'berryEmoteFavorites',
    center: true,
  });

  const results = $('<div/>')
    .addClass('berryemotes-favorites-results')
    .css({
      width: '500px',
      height: '500px',
      'overflow-y': 'scroll',
    })
    .appendTo(favsDialogContent);

  results.on('click', '.berryemote', (event) => {
    if (Bem.lastFocus) {
      const $emote = $(event.currentTarget);
      const id = parseInt($emote.attr('emote_id'), 10);
      const emote = Bem.emotes[id];
      Bem.insertAtCursor(Bem.lastFocus, `[](/${emote.names[0]})`);

      favsDialogContent.window.close();
      $(document.body).find('.dialogWindow.berrymotes').remove();
      Bem.lastFocus.focus();
    }
  });

  results.on('contextmenu', '.berryemote', (event) => {
    const $emote = $(event.target);
    const emoteId = parseInt($emote.attr('emote_id'), 10);

    const onClick = () => {
      favoritesStore.removeEmote(emoteId);
      $emote.remove();

      return true;
    };

    createSingleButtonContextMenu({
      uid: 'bemRemoveFavorite',
      top: event.pageY,
      left: event.pageX,
      text: 'Remove From Favorites',
      onClick,
    });

    return false;
  });

  const favorites = favoritesStore.getFavorites();
  forEach(favorites, (favorite) => {
    const $emote = $('<span/>')
      .css('margin', '2px')
      .append(Bem.getEmoteHtml(favorite));
    Bem.postEmoteEffects($emote, true);
    results.append($emote);
  });

  favsDialogContent.window.center();
}
