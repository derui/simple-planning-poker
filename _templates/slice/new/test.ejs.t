---
to: src/status/slices/<%= name %>.test.ts
---
import {test, expect} from 'vitest';
import {getInitialState} from './<%= name %>';

test('initial state', () => {
  expect(getInitialState()).toEqual({});
});
