import { expect, test } from 'vitest';
import { calc } from '../src/calculations.js';

test('No vehicle', () => {
  expect(
    calc({
      state: { vehicle: '' },
    }),
  ).toBe(null);
});

test('Invalid date', () => {
  expect(
    calc({
      state: { approval: 'no_valid_date' },
    }),
  ).toBe(null);
});
