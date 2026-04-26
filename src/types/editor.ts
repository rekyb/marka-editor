export interface DocumentState {
  content: string;
  fileName: string;
  isDirty: boolean;
}

export interface HistoryState {
  past: string[];
  present: string;
  future: string[];
}

export type FormattingCommand =
  | 'bold'
  | 'italic'
  | 'code'
  | 'link'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'codeBlock'
  | 'quote'
  | 'horizontalRule';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  callback: () => void;
  description: string;
}
