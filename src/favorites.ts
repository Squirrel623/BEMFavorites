import Bem from 'bem';

import isArray from 'lodash-es/isArray';
import filter from 'lodash-es/filter';
import forEach from 'lodash-es/foreach';
import map from 'lodash-es/map';
import find from 'lodash-es/find';
import remove from 'lodash-es/remove';

import { get, set, clear } from './settings';

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
  private favoriteEmotes: Bem.Emote[];

  constructor() {
    if (!Bem || !Bem.emotes) {
      throw new Error('Berrymotes not installed or initialized');
    }

    let serializedFavorites = get<SerializedFavorites>(favoritesStorageKey);
    if (serializedFavorites === null) {
      serializedFavorites = [];
    }

    const nameToEmoteIndexMap = getNameToEmoteIndexMap(Bem.emotes);
    const favorites: Bem.Emote[] = [];

    forEach(serializedFavorites, (emoteNames) => {
      if (!isArray(emoteNames) || emoteNames.length < 1) {
        throw new Error('Badly formed serialization');
      }

      let emote: Bem.Emote|undefined;
      for (let i = 0; i < emoteNames.length; i++) {
        emote = Bem.emotes[nameToEmoteIndexMap[emoteNames[i]]];
        if (emote !== undefined) {
          break;
        }
      }

      if (emote !== undefined) {
        favorites.push(emote);
      }
    });

    this.favoriteEmotes = favorites;
  }

  public getFavorites(): ReadonlyArray<Readonly<Bem.Emote>> {
    return this.favoriteEmotes;
  }

  public addEmote(emoteId: number): boolean {
    if (find(this.favoriteEmotes, (favoriteEmote: Bem.Emote) => favoriteEmote.id === emoteId)) {
      return false;
    }

    this.favoriteEmotes.push(Bem.emotes[emoteId]);
    this.saveFavorites();

    return true;
  }

  public removeEmote(emoteId: number): boolean {
    const removedElements = remove(this.favoriteEmotes, (favoriteEmote) => favoriteEmote.id === emoteId);
    this.saveFavorites();

    return removedElements.length > 0;
  }

  public clearFavorites(): void {
    this.favoriteEmotes = [];
    this.saveFavorites();
  }

  private saveFavorites() {
    const serializedFavorites: SerializedFavorites = map(this.favoriteEmotes, (favorite) => {
      return favorite.names;
    });

    set(favoritesStorageKey, serializedFavorites);
  }
}
