import { renderHook, act } from '@testing-library/react';
import { useSSE } from './useSSE';

describe('useSSE hook', () => {
  // Mock EventSource implementation
  class MockEventSource {
    onmessage: ((this: EventSource, ev: MessageEvent) => any) | null = null;
    onerror: ((this: EventSource, ev: MessageEvent) => any) | null = null;

    constructor(url: string) {
      // Simulate connection
      setTimeout(() => {
        // Simulate receiving data
        const messageEvent = new MessageEvent('message', { data: JSON.stringify({ message: 'Test data' }) });
        // this.onmessage && this.onmessage.call(this, messageEvent);
      }, 1000);
    }

    close() {
      // Simulate closing connection
    }
  }

  // Save reference to the original EventSource to restore it later
  const originalEventSource = global.EventSource;

  // Setup mock EventSource
  beforeEach(() => {
    global.EventSource = MockEventSource as any;
  });

  // Restore original EventSource
  afterEach(() => {
    global.EventSource = originalEventSource;
  });

  it('should establish an SSE connection and receive data', async () => {
    // Setup the initial hook
    const { result } = renderHook(() => useSSE('http://example.com/sse'));

    // Wait for data to be received
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating asynchronous behavior
    });

    // Check the data state after the mock event data has been received
    expect(result.current.data).toEqual({ message: 'Test data' });
    expect(result.current.error).toBeFalsy();
  });

  it('should handle connection errors', async () => {
    // Mock EventSource constructor to throw an error
    class ErrorEventSource {
      constructor(url: string) {
        throw new Error('Connection error');
      }
    }

    // Save reference to the original EventSource to restore it later
    const originalEventSource = global.EventSource;

    // Setup mock EventSource to throw an error
    beforeEach(() => {
      global.EventSource = ErrorEventSource as any;
    });

    // Restore original EventSource
    afterEach(() => {
      global.EventSource = originalEventSource;
    });

    // Setup the initial hook
    const { result } = renderHook(() => useSSE('http://example.com/sse'));

    // Wait for error to be handled
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0)); // Simulating asynchronous behavior
    });

    // Check the error state
    expect(result.current.error).toBeTruthy();
  });
});
