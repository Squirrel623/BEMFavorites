import Bem from 'bem';

import isArray from 'lodash-es/isArray';
import filter from 'lodash-es/filter';
import forEach from 'lodash-es/foreach';
import map from 'lodash-es/map';
import find from 'lodash-es/find';
import remove from 'lodash-es/remove';

import { get, set, clear } from './settings';
import { getBemInitPromise } from './util';

const favoritesStorageKey = 'bemFavorites';

type SerializedFavorites = string[][];

function getNameToEmoteIndexMap(emotes: Bem.Emote[]): {[index: string]: number} {
  const emoteMap: {[index: string]: number} = {};

  forEach(emotes, (emote: Bem.Emote) => {
    forEach(emote.names, (name) => {
      emoteMap[name] = emote.id;
    });
  });

  return emoteMap;
}

export class FavoritesStore {
  private allEmotesPromise: Promise<Bem.Emote[]>;
  private emoteInitPromise: Promise<Bem.Emote[]>;

  private allEmotes?: Bem.Emote[];
  private favoriteEmotes?: Bem.Emote[];

  constructor() {
    this.allEmotesPromise = getBemInitPromise().then((emotes) => {
      this.allEmotes = emotes;
      return emotes;
    });

    this.emoteInitPromise = this.allEmotesPromise.then((emotes) => {
      let serializedFavorites = get<SerializedFavorites>(favoritesStorageKey);
      if (serializedFavorites === null) {
        serializedFavorites = [];
      }

      const nameToEmoteIndexMap = getNameToEmoteIndexMap(emotes);
      const favorites: Bem.Emote[] = [];

      forEach(serializedFavorites, (emoteNames) => {
        if (!isArray(emoteNames) || emoteNames.length < 1) {
          throw new Error('Badly formed serialization');
        }

        let emote: Bem.Emote|undefined;
        for (let i = 0; i < emoteNames.length; i++) {
          emote = emotes[nameToEmoteIndexMap[emoteNames[i]]];
          if (emote !== undefined) {
            break;
          }
        }

        if (emote !== undefined) {
          favorites.push(emote);
        }
      });

      this.favoriteEmotes = favorites;
      return this.favoriteEmotes;
    });
  }

  public getFavorites(): Promise<ReadonlyArray<Readonly<Bem.Emote>>> {
    if (this.favoriteEmotes !== undefined) {
      return Promise.resolve(this.favoriteEmotes);
    }

    return this.emoteInitPromise;
  }

  public addEmote(emoteId: number): Promise<boolean> {
    return this.emoteInitPromise.then(() => {
      if (this.allEmotes === undefined || this.favoriteEmotes === undefined) {
        throw new Error('Something really went wrong');
      }

      if (find(this.favoriteEmotes, (favoriteEmote: Bem.Emote) => favoriteEmote.id === emoteId)) {
        return false;
      }

      this.favoriteEmotes.push(this.allEmotes[emoteId]);
      this.saveFavorites();

      return true;
    });
  }

  public removeEmote(emoteId: number): Promise<boolean> {
    return this.emoteInitPromise.then(() => {
      if (this.allEmotes === undefined || this.favoriteEmotes === undefined) {
        throw new Error('Something really went wrong');
      }

      const removedElements = remove(this.favoriteEmotes, (favoriteEmote) => favoriteEmote.id === emoteId);
      this.saveFavorites();

      return removedElements.length > 0;
    });
  }

  public clearFavorites(): Promise<void> {
    return this.emoteInitPromise.then(() => {
      if (this.allEmotes === undefined || this.favoriteEmotes === undefined) {
        throw new Error('Something really went wrong');
      }

      this.favoriteEmotes = [];
      this.saveFavorites();
    });
  }

  private saveFavorites() {
    const serializedFavorites: SerializedFavorites = map(this.favoriteEmotes, (favorite) => {
      return favorite.names;
    });

    set(favoritesStorageKey, serializedFavorites);
  }
}
