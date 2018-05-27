interface DialogWindowArgs {
  title?: string;
  uid?: any;
  offset?: {top: number, left: number};
  onClose?: () => void;
  center?: boolean;
  toolBox?: boolean;
  initialLoading?: boolean;
}

interface DialogWindow extends JQuery {
  close: () => void;
  setLoaded: () => void;
  winFocus: () => void;
}

interface DialogContents extends JQuery {
  window: DialogWindow;
}

interface JQueryStatic {
  dialogWindow(options: DialogWindowArgs): DialogContents;
}

interface JQuery {
  center: () => void;
  dialogWindow(options: DialogWindowArgs): DialogContents;
}
