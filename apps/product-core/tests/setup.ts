import { mock } from 'bun:test';
import { JSDOM } from 'jsdom';

// server-only throws when window is defined; mock it so server modules load in tests
mock.module('server-only', () => ({}));

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000/en',
  pretendToBeVisual: true,
});

globalThis.window = dom.window as unknown as Window & typeof globalThis;
globalThis.document = dom.window.document;
globalThis.navigator = dom.window.navigator;
globalThis.Node = dom.window.Node;
globalThis.Element = dom.window.Element;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.SVGElement = dom.window.SVGElement;
globalThis.DocumentFragment = dom.window.DocumentFragment;
globalThis.Text = dom.window.Text;
globalThis.Comment = dom.window.Comment;
globalThis.Event = dom.window.Event;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
globalThis.DOMRect = dom.window.DOMRect;
globalThis.HTMLSpanElement = dom.window.HTMLSpanElement;
globalThis.HTMLDivElement = dom.window.HTMLDivElement;
globalThis.HTMLAnchorElement = dom.window.HTMLAnchorElement;
globalThis.HTMLButtonElement = dom.window.HTMLButtonElement;
