declare interface Emote {
    'background-image': string;
    id: number;
    names: string[];
    tags: string[];
}

declare const Bem: {
  readonly emotes: Emote[];
  readonly lastFocus: JQuery|undefined;

  readonly getEmoteHtml: (emote: Emote) => string;
  readonly postEmoteEffects: (emote: JQuery, idunno: boolean) => void;
  readonly insertAtCursor: (elem: JQuery, text: string) => void;
  showBerrymoteSearch: () => void;
};
