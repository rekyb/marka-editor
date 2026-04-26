import { render, screen, fireEvent } from '@testing-library/react';
import { StatusBar } from './index';
import { StatusBarStats } from '@/hooks/useStatusBar';

const mockStats: StatusBarStats = {
  wordCount: 42,
  characterCount: 234,
  lineCount: 8,
  fileSize: 2048,
};

describe('StatusBar', () => {
  it('should render desktop version with file info and stats', () => {
    const originalInnerWidth = window.innerWidth;
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    render(
      <StatusBar
        stats={mockStats}
        fileName="test.md"
        isDirty={false}
      />
    );

    expect(screen.getByText('test.md')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('234')).toBeInTheDocument();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    });
  });

  it('should show dirty indicator when isDirty is true', () => {
    render(
      <StatusBar
        stats={mockStats}
        fileName="test.md"
        isDirty={true}
      />
    );

    expect(screen.getByText('●')).toBeInTheDocument();
  });

  it('should hide dirty indicator when isDirty is false', () => {
    render(
      <StatusBar
        stats={mockStats}
        fileName="test.md"
        isDirty={false}
      />
    );

    const dirtyIndicators = screen.queryAllByText('●');
    expect(dirtyIndicators.length).toBe(0);
  });

  it('should format file size correctly', () => {
    const stats: StatusBarStats = {
      wordCount: 10,
      characterCount: 50,
      lineCount: 5,
      fileSize: 1024,
    };

    render(
      <StatusBar
        stats={stats}
        fileName="test.md"
        isDirty={false}
      />
    );

    expect(screen.getByText(/1\.0 KB/)).toBeInTheDocument();
  });

  it('should format large file size in MB', () => {
    const stats: StatusBarStats = {
      wordCount: 10,
      characterCount: 50,
      lineCount: 5,
      fileSize: 1048576,
    };

    render(
      <StatusBar
        stats={stats}
        fileName="test.md"
        isDirty={false}
      />
    );

    expect(screen.getByText(/1\.0 MB/)).toBeInTheDocument();
  });

  it('should attach resize listener on mount', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');

    render(
      <StatusBar
        stats={mockStats}
        fileName="test.md"
        isDirty={false}
      />
    );

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    addEventListenerSpy.mockRestore();
  });

  it('should remove resize listener on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(
      <StatusBar
        stats={mockStats}
        fileName="test.md"
        isDirty={false}
      />
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'resize',
      expect.any(Function)
    );

    removeEventListenerSpy.mockRestore();
  });

  it('should update to mobile view when window resizes below 768px', () => {
    const { container } = render(
      <StatusBar
        stats={mockStats}
        fileName="test.md"
        isDirty={false}
      />
    );

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    fireEvent.resize(window);

    const compactText = container.textContent;
    expect(compactText).toMatch(/\dw/);
  });
});
