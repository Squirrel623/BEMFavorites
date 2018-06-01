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
