declare module 'bem' {
  interface Emote {
    'background-image': string;
    id: number;
    names: string[];
    tags: string[];
  }

  export const emotes: Emote[];
  export const lastFocus: JQuery|undefined;

  export const getEmoteHtml: (emote: Emote) => string;
  export const postEmoteEffects: (emote: JQuery, idunno: boolean) => void;
  export const insertAtCursor: (elem: JQuery, text: string) => void;
}
