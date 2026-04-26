import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDocument } from './useDocument';

describe('useDocument', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useDocument());
    expect(result.current.state.content).toBe('');
    expect(result.current.state.fileName).toBe('untitled.md');
    expect(result.current.state.isDirty).toBe(false);
  });

  it('initializes with custom fileName', () => {
    const { result } = renderHook(() => useDocument('custom.md'));
    expect(result.current.state.fileName).toBe('custom.md');
  });

  it('setContent updates content and marks dirty', () => {
    const { result } = renderHook(() => useDocument());
    act(() => {
      result.current.setContent('# Hello World');
    });
    expect(result.current.state.content).toBe('# Hello World');
    expect(result.current.state.isDirty).toBe(true);
  });

  it('setFileName updates fileName and marks dirty', () => {
    const { result } = renderHook(() => useDocument());
    act(() => {
      result.current.setFileName('newfile.md');
    });
    expect(result.current.state.fileName).toBe('newfile.md');
    expect(result.current.state.isDirty).toBe(true);
  });

  it('markClean sets isDirty to false', () => {
    const { result } = renderHook(() => useDocument());
    act(() => {
      result.current.setContent('test');
    });
    expect(result.current.state.isDirty).toBe(true);
    act(() => {
      result.current.markClean();
    });
    expect(result.current.state.isDirty).toBe(false);
  });

  it('markDirty sets isDirty to true', () => {
    const { result } = renderHook(() => useDocument());
    act(() => {
      result.current.markDirty();
    });
    expect(result.current.state.isDirty).toBe(true);
  });

  it('persists state to localStorage', () => {
    const { result } = renderHook(() => useDocument());
    act(() => {
      result.current.setContent('persisted content');
    });
    const stored = localStorage.getItem('markdown-editor-document');
    expect(stored).toBeTruthy();
    const parsed = JSON.parse(stored!);
    expect(parsed.content).toBe('persisted content');
  });

  it('restores state from localStorage on mount', () => {
    const initialState = {
      content: 'restored content',
      fileName: 'restored.md',
      isDirty: false,
    };
    localStorage.setItem('markdown-editor-document', JSON.stringify(initialState));
    const { result } = renderHook(() => useDocument());
    expect(result.current.state.content).toBe('restored content');
    expect(result.current.state.fileName).toBe('restored.md');
  });
});
