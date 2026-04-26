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

  it('should handle drop of valid markdown file', async () => {
    const { container } = render(<EditorLayout />);
    const mainDiv = container.querySelector('[style*="display: flex"]') as HTMLElement;

    const fileContent = '# Test File\nMarkdown content';
    const file = new File([fileContent], 'test.md', { type: 'text/markdown' });

    const dropEvent = new DragEvent('drop', {
      dataTransfer: new DataTransfer(),
      bubbles: true,
    });
    dropEvent.dataTransfer?.items.add(file);

    fireEvent.drop(mainDiv, { dataTransfer: dropEvent.dataTransfer });

    await waitFor(() => {
      expect(mainDiv).toHaveStyle({ backgroundColor: 'rgb(250, 250, 250)' });
    });
  });

  it('should reject non-markdown files', () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
    const { container } = render(<EditorLayout />);
    const mainDiv = container.querySelector('[style*="display: flex"]') as HTMLElement;

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const dropEvent = new DragEvent('drop', {
      dataTransfer: new DataTransfer(),
      bubbles: true,
    });
    dropEvent.dataTransfer?.items.add(file);

    fireEvent.drop(mainDiv, { dataTransfer: dropEvent.dataTransfer });

    expect(consoleSpy).toHaveBeenCalledWith('Only markdown files are supported');
    consoleSpy.mockRestore();
  });

  it('should show visual feedback on drag over', () => {
    const { container } = render(<EditorLayout />);
    const mainDiv = container.querySelector('[style*="display: flex"]') as HTMLElement;

    const dragOverEvent = new DragEvent('dragover', { bubbles: true });
    fireEvent.dragOver(mainDiv, { dataTransfer: new DataTransfer() });

    expect(mainDiv).toHaveStyle({
      backgroundColor: 'rgba(25, 118, 210, 0.05)',
      borderTop: '2px dashed rgb(25, 118, 210)',
    });
  });

  it('should remove visual feedback on drag leave', () => {
    const { container } = render(<EditorLayout />);
    const mainDiv = container.querySelector('[style*="display: flex"]') as HTMLElement;

    fireEvent.dragOver(mainDiv, { dataTransfer: new DataTransfer() });
    expect(mainDiv).toHaveStyle({ backgroundColor: 'rgba(25, 118, 210, 0.05)' });

    fireEvent.dragLeave(mainDiv);
    expect(mainDiv).toHaveStyle({ backgroundColor: 'rgb(250, 250, 250)' });
  });

  it('should handle file read errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const { container } = render(<EditorLayout />);
    const mainDiv = container.querySelector('[style*="display: flex"]') as HTMLElement;

    const file = new File(['content'], 'test.md', { type: 'text/markdown' });
    const dropEvent = new DragEvent('drop', {
      dataTransfer: new DataTransfer(),
      bubbles: true,
    });
    dropEvent.dataTransfer?.items.add(file);

    jest.spyOn(FileReader.prototype, 'readAsText').mockImplementation(function () {
      setTimeout(() => {
        this.onerror?.(new ProgressEvent('error'));
      }, 0);
    });

    fireEvent.drop(mainDiv, { dataTransfer: dropEvent.dataTransfer });

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to read dropped file');
    });

    consoleErrorSpy.mockRestore();
    jest.restoreAllMocks();
  });
});
