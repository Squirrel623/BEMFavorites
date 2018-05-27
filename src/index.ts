import $ from 'jquery';
import Bem from 'bem';
import find from 'lodash-es/find';
import filter from 'lodash-es/filter';
import includes from 'lodash-es/includes';
import remove from 'lodash-es/remove';
import forEach from 'lodash-es/foreach';

import { StartBemFavorites } from './bem-favorites';
import { bemInitPromise } from './util';

console.log('BEMFavories Loaded');

let shutDown: () => void | undefined;

bemInitPromise.then(() => {
  console.log('BEMFavorites Started');

  shutDown = StartBemFavorites();
}, (err) => {
  console.error('BerryEmote Favorites failed to load. Do you have BerryEmotes installed?');
});

export function dispose() {
  if (shutDown) {
    shutDown();
  }
}
