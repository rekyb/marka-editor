export interface DocumentState {
  readonly content: string;
  readonly fileName: string;
  readonly isDirty: boolean;
}

export interface HistoryState {
  readonly past: readonly string[];
  readonly present: string;
  readonly future: readonly string[];
}

export type FormattingCommand =
  | 'bold'
  | 'italic'
  | 'code'
  | 'link'
  | 'image'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'orderedList'
  | 'codeBlock'
  | 'quote'
  | 'horizontalRule'
  | 'table';

export interface KeyboardShortcut {
  readonly key: string;
  readonly ctrl?: boolean;
  readonly shift?: boolean;
  readonly alt?: boolean;
  readonly callback: () => void;
  readonly description: string;
}
