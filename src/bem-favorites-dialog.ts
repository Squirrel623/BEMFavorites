import $ from 'jquery';
import Bem from 'bem';
import find from 'lodash-es/find';
import filter from 'lodash-es/filter';
import includes from 'lodash-es/includes';
import remove from 'lodash-es/remove';
import forEach from 'lodash-es/foreach';

import { FavoritesStore } from './favorites-store';
import { createSingleButtonContextMenu, bemInitPromise } from './util';

function showResults({resultsElement, favoritesStore, start, end}: {
  resultsElement: JQuery,
  favoritesStore: FavoritesStore,
  start: number,
  end: number
}) {
  resultsElement.empty();

  const favorites = favoritesStore.getFavorites();
  for (let i = start; i < favorites.length && i < end; i++) {
    const $emote = $('<span/>')
      .css('margin', '2px')
      .append(Bem.getEmoteHtml(favorites[i]));
    Bem.postEmoteEffects($emote, true);
    resultsElement.append($emote);
  }
}

function createResultsElement(dialogContent: DialogContents, favoritesStore: FavoritesStore, requestClose: () => void) {
  const results = $('<div/>')
    .addClass('berryemotes-favorites-results')
    .css({
      width: '500px',
      height: '500px',
      'overflow-y': 'scroll',
    })
    .appendTo(dialogContent);

  results.on('click', '.berryemote', (event) => {
    if (Bem.lastFocus) {
      const $emote = $(event.currentTarget);
      const id = parseInt($emote.attr('emote_id'), 10);
      const emote = Bem.emotes[id];
      Bem.insertAtCursor(Bem.lastFocus, `[](/${emote.names[0]})`);
      Bem.lastFocus.focus();

      requestClose();
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

  return results;
}

export function createFavoritesDialog(favoritesStore: FavoritesStore) {
  const dialogContent = $('body').dialogWindow({
    title: 'BerryEmote Favorites',
    uid: 'berryEmoteFavorites',
    center: true,
  });

  const pageSize = 50;
  let page = 0;
  let resultsElement: JQuery;

  const showResultsForCurrentPage = () => {
    showResults({
      resultsElement,
      favoritesStore,
      start: page * pageSize,
      end: (page + 1) * pageSize,
    });
  };

  const prevClick = () => {
    if (page > 0) {
      page--;
      showResultsForCurrentPage();
    }
  };
  const nextClick = () => {
    const numFavorites = favoritesStore.getFavorites().length;
    const maxIndexShown = (page + 1) * pageSize;

    if (numFavorites > maxIndexShown) {
      page++;
      showResultsForCurrentPage();
    }
  };

  $('<span/>')
    .text('< Prev')
    .addClass('bemf_prev_page')
    .css({
      cursor: 'pointer',
      'text-decoration': 'underline',
      'user-select': 'none',
    })
    .click(prevClick)
    .appendTo(dialogContent);

  $('<span/>')
    .text('Next >')
    .addClass('bemf_next_page')
    .css({
      cursor: 'pointer',
      'text-decoration': 'underline',
      'margin-left': '5px',
      'user-select': 'none',
    })
    .click(nextClick)
    .appendTo(dialogContent);

  resultsElement = createResultsElement(dialogContent, favoritesStore, () => {
    dialogContent.window.close();
    $(document.body).find('.dialogWindow.berrymotes').remove();
  });
  showResultsForCurrentPage();

  dialogContent.window.center();
}
