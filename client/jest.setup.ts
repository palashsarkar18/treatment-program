// jest.setup.ts
import '@testing-library/jest-dom';

declare global {
  let MockEventSource: {
    new(url: string, init?: EventSourceInit): EventSource;
    prototype: EventSource;
    CONNECTING: number;
    OPEN: number;
    CLOSED: number;
  };
}

MockEventSource = jest.fn(() => ({
    CONNECTING: 0,
    OPEN: 1,
    CLOSED: 2,
    prototype: {},
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    close: jest.fn(),
    onmessage: jest.fn(),
    onerror: jest.fn(),
})) as any;

export {};
