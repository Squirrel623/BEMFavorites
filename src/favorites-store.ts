import { find, remove, forEach, map, every, isArray } from './my-lodash';
import { get, set, clear } from './settings';

const favoritesStorageKey = 'bemFavorites';

type SerializedFavorites = string[][];

function getNameToEmoteIndexMap(emotes: Emote[]): {[index: string]: number} {
  const emoteMap: {[index: string]: number} = {};

  forEach(emotes, (emote: Emote) => {
    forEach(emote.names, (name) => {
      emoteMap[name] = emote.id;
    });
  });

  return emoteMap;
}

function isSerializedInputGood(input: any): input is SerializedFavorites {
  return isArray(input) &&
    every(input, (inputItem) => isArray(inputItem) && inputItem.length > 0);
}

export class FavoritesStore {
  private favoriteEmotes!: Emote[];

  constructor() {
    if (!Bem || !Bem.emotes) {
      throw new Error('Berrymotes not installed or initialized');
    }

    let serializedFavorites = get<SerializedFavorites>(favoritesStorageKey);
    if (serializedFavorites === null) {
      serializedFavorites = [];
    }

    if (!isSerializedInputGood(serializedFavorites)) {
      throw new Error('Badly formed serialization');
    }

    this.deserializeInput(serializedFavorites);
  }

  public getFavorites(): ReadonlyArray<Readonly<Emote>> {
    return this.favoriteEmotes;
  }

  public addEmote(emoteId: number): boolean {
    if (find(this.favoriteEmotes, (favoriteEmote: Emote) => favoriteEmote.id === emoteId)) {
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

  public importFavorites(): Promise<boolean> {
    console.log('Importing favorites');
    const importDialogContents = $('body').dialogWindow({
      title: 'Import Favorites',
      uid: 'bemfImportFavorites',
      center: true,
    });

    const warning = $('<div/>')
      .text('Warning! Successfully importing will replace currently saved favorites!')
      .css({
        'font-weight': 'bold',
        'margin-top': '5px',
        'margin-bottom': '15px',
      })
      .appendTo(importDialogContents);

    const fileInput = $('<input/>')
      .attr('type', 'file')
      .attr('accept', '.bemf')
      .appendTo(importDialogContents);
    const rawFileInput = fileInput[0] as HTMLInputElement;

    importDialogContents.window.center();

    return new Promise<boolean>((resolve, reject) => {
      fileInput.on('change', () => {
        if (!rawFileInput.files || !rawFileInput.files[0]) {
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target === null) {
            return resolve(false);
          }

          let result: any;
          try {
            result = JSON.parse(event.target.result);
          } catch {
            console.warn('Tried loading ill-formed input');
            return resolve(false);
          }

          if (!isSerializedInputGood(result)) {
            console.warn('Tried loading ill-formed input');
            return resolve(false);
          }

          this.deserializeInput(result);
          return resolve(true);
        };

        try {
          reader.readAsText(rawFileInput.files[0]);
        } catch {
          console.warn('Tried loading ill-formed input');
          return resolve(false);
        }
      });
    }).then((result) => {
      importDialogContents.window.remove();
      return result;
    }, () => {
      importDialogContents.window.remove();
      return false;
    });
  }

  public exportFavorites() {
    const blob = new Blob([JSON.stringify(this.serializeFavorites())], { type: 'text/plain' });

    const anchor = document.createElement('a');
    anchor.download = 'bem-favorites.bemf';
    anchor.href = window.URL.createObjectURL(blob);
    anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
    anchor.click();
  }

  public serializeFavorites() {
    const serializedFavorites: SerializedFavorites = map(this.favoriteEmotes, (favorite) => {
      return favorite.names;
    });

    return serializedFavorites;
  }

  private deserializeInput(serializedFavorites: SerializedFavorites) {
    const nameToEmoteIndexMap = getNameToEmoteIndexMap(Bem.emotes);
    const favorites: Emote[] = [];

    forEach(serializedFavorites, (emoteNames) => {
      let emote: Emote|undefined;
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

  private saveFavorites() {
    set(favoritesStorageKey, this.serializeFavorites());
  }
}
