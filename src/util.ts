import Bem from 'bem';

export function getBemInitPromise(): Promise<Bem.Emote[]> {
  return new Promise((resolve) => {
    if (typeof Bem.emotes !== 'undefined') {
      return resolve(Bem.emotes);
    }

    const intervalId = setInterval(() => {
      if (typeof Bem.emotes !== 'undefined') {
        clearInterval(intervalId);
        resolve(Bem.emotes);
      }
    }, 100);
  });
}

export interface ContextMenuArgs {
  uid: string;
  top: number;
  left: number;
  text: string;
  onClick: () => boolean;
}

export function createSingleButtonContextMenu(options: ContextMenuArgs) {
  const contextMenuContents = $('body').dialogWindow({
    uid: options.uid,
    offset: {
      top: options.top,
      left: options.left,
    },
    toolBox: true,
  });
  contextMenuContents.window.contextmenu(() => false);

  const list = $('<ul class="optionList"/>').appendTo(contextMenuContents);
  const listItem = $('<li/>').appendTo(list);
  const addButton = $(`<div class="button"><span>${options.text}</span></div>`).appendTo(listItem);

  addButton.click(() => {
    const close = options.onClick();

    if (close) {
      contextMenuContents.window.remove();
    }
  });
}
