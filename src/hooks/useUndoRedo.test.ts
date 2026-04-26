import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUndoRedo } from './useUndoRedo';

describe('useUndoRedo', () => {
  it('initializes with default content', () => {
    const { result } = renderHook(() => useUndoRedo());
    expect(result.current.content).toBe('');
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('initializes with initial content', () => {
    const { result } = renderHook(() => useUndoRedo('initial'));
    expect(result.current.content).toBe('initial');
  });

  it('push adds to history', () => {
    const { result } = renderHook(() => useUndoRedo());
    act(() => {
      result.current.record('content1');
    });
    expect(result.current.content).toBe('content1');
    expect(result.current.canUndo).toBe(false);
    act(() => {
      result.current.record('content2');
    });
    expect(result.current.content).toBe('content2');
    expect(result.current.canUndo).toBe(true);
  });

  it('undo restores previous content', () => {
    const { result } = renderHook(() => useUndoRedo());
    act(() => {
      result.current.record('content1');
      result.current.record('content2');
    });
    expect(result.current.content).toBe('content2');
    act(() => {
      result.current.undo();
    });
    expect(result.current.content).toBe('content1');
    expect(result.current.canRedo).toBe(true);
  });

  it('redo restores future content', () => {
    const { result } = renderHook(() => useUndoRedo());
    act(() => {
      result.current.record('content1');
      result.current.record('content2');
      result.current.undo();
    });
    expect(result.current.content).toBe('content1');
    act(() => {
      result.current.redo();
    });
    expect(result.current.content).toBe('content2');
  });

  it('undo does nothing at beginning of history', () => {
    const { result } = renderHook(() => useUndoRedo());
    act(() => {
      result.current.record('content1');
    });
    const currentContent = result.current.content;
    act(() => {
      result.current.undo();
    });
    expect(result.current.content).toBe(currentContent);
  });

  it('redo does nothing at end of history', () => {
    const { result } = renderHook(() => useUndoRedo());
    act(() => {
      result.current.record('content1');
      result.current.record('content2');
    });
    const currentContent = result.current.content;
    act(() => {
      result.current.redo();
    });
    expect(result.current.content).toBe(currentContent);
  });

  it('push after undo clears future', () => {
    const { result } = renderHook(() => useUndoRedo());
    act(() => {
      result.current.record('content1');
      result.current.record('content2');
      result.current.undo();
    });
    expect(result.current.canRedo).toBe(true);
    act(() => {
      result.current.record('content3');
    });
    expect(result.current.content).toBe('content3');
    expect(result.current.canRedo).toBe(false);
  });

  it('maintains correct canUndo and canRedo flags', () => {
    const { result } = renderHook(() => useUndoRedo());
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    act(() => {
      result.current.record('1');
    });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
    act(() => {
      result.current.record('2');
    });
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
    act(() => {
      result.current.undo();
    });
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });
});
