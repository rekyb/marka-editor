import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditorLayout from './page';

jest.mock('@/components/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

jest.mock('@/components/Editor', () => ({
  Editor: ({ onChange }: any) => (
    <div data-testid="editor">
      <button
        onClick={() =>
          onChange('test content', {
            state: { doc: { lineAt: () => ({ from: 0 }) } },
          })
        }
      >
        Update Content
      </button>
    </div>
  ),
}));

jest.mock('@/components/Preview', () => ({
  Preview: () => <div data-testid="preview">Preview</div>,
}));

jest.mock('@/components/StatusBar', () => ({
  StatusBar: ({ stats, fileName, isDirty }: any) => (
    <div data-testid="status-bar">
      <span>{fileName}</span>
      <span>{stats.wordCount}</span>
      <span>{stats.characterCount}</span>
      <span>{stats.lineCount}</span>
    </div>
  ),
}));

jest.mock('@/components/ImageInsertModal', () => ({
  ImageInsertModal: () => <div data-testid="image-modal">Image Modal</div>,
}));

jest.mock('@/hooks/useDocument', () => ({
  useDocument: () => ({
    state: {
      fileName: 'test.md',
      isDirty: false,
      content: 'test content',
    },
    setContent: jest.fn(),
  }),
}));

describe('EditorLayout', () => {
  it('should render header, editor, status bar, and image modal', () => {
    render(<EditorLayout />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('editor')).toBeInTheDocument();
    expect(screen.getByTestId('status-bar')).toBeInTheDocument();
    expect(screen.getByTestId('image-modal')).toBeInTheDocument();
  });

  it('should display status bar with fileName', () => {
    render(<EditorLayout />);

    expect(screen.getByText('test.md')).toBeInTheDocument();
  });

  it('should update status bar stats when content changes', async () => {
    render(<EditorLayout />);

    const updateButton = screen.getByText('Update Content');
    fireEvent.click(updateButton);

    await waitFor(() => {
      const statusBar = screen.getByTestId('status-bar');
      expect(statusBar).toBeInTheDocument();
    });
  });

  it('should pass correct props to StatusBar', () => {
    const { rerender } = render(<EditorLayout />);

    const statusBar = screen.getByTestId('status-bar');
    expect(statusBar).toBeInTheDocument();
    expect(screen.getByText('test.md')).toBeInTheDocument();
  });
});
