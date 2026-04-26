import { renderHook } from '@testing-library/react';
import { useStatusBar } from './useStatusBar';

describe('useStatusBar', () => {
  it('should return 0 for empty content', () => {
    const { result } = renderHook(() => useStatusBar(''));
    expect(result.current.wordCount).toBe(0);
    expect(result.current.characterCount).toBe(0);
    expect(result.current.lineCount).toBe(0);
    expect(result.current.fileSize).toBe(0);
  });

  it('should count single word correctly', () => {
    const { result } = renderHook(() => useStatusBar('hello'));
    expect(result.current.wordCount).toBe(1);
    expect(result.current.characterCount).toBe(5);
    expect(result.current.lineCount).toBe(1);
    expect(result.current.fileSize).toBe(5);
  });

  it('should count multiple words correctly', () => {
    const { result } = renderHook(() => useStatusBar('hello world'));
    expect(result.current.wordCount).toBe(2);
    expect(result.current.characterCount).toBe(10);
    expect(result.current.lineCount).toBe(1);
    expect(result.current.fileSize).toBe(11);
  });

  it('should count multiple lines correctly', () => {
    const { result } = renderHook(() => useStatusBar('hello\nworld\ntest'));
    expect(result.current.wordCount).toBe(3);
    expect(result.current.characterCount).toBe(13);
    expect(result.current.lineCount).toBe(3);
    expect(result.current.fileSize).toBe(16);
  });

  it('should handle multiple spaces and tabs', () => {
    const { result } = renderHook(() => useStatusBar('hello  \t  world'));
    expect(result.current.wordCount).toBe(2);
    expect(result.current.characterCount).toBe(10);
    expect(result.current.lineCount).toBe(1);
  });

  it('should handle trailing newline', () => {
    const { result } = renderHook(() => useStatusBar('hello\n'));
    expect(result.current.wordCount).toBe(1);
    expect(result.current.characterCount).toBe(5);
    expect(result.current.lineCount).toBe(2);
  });

  it('should calculate correct file size for UTF-8 characters', () => {
    const { result } = renderHook(() => useStatusBar('café'));
    expect(result.current.fileSize).toBeGreaterThan(4);
  });

  it('should only recalculate when content changes', () => {
    const { result, rerender } = renderHook(
      ({ content }) => useStatusBar(content),
      { initialProps: { content: 'hello' } }
    );

    const firstResult = result.current;
    rerender({ content: 'hello' });
    expect(result.current).toBe(firstResult);

    rerender({ content: 'world' });
    expect(result.current).not.toBe(firstResult);
  });
});
