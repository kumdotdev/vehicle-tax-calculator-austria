import { expect, test } from 'vitest';
import { calc } from '../src/calculations.js';

test('Motorcycle Combustion 2020-09-30 (pre 2020-10-01)', () => {
  expect(
    calc({
      method: 'month',
      state: { vehicle: 'motorcycle', approval: '2020-09-30', ccm: '1000' },
    }),
  ).toBe(27.5);
});

test('Motorcycle Combustion 2020-09-30 (pre 2020-10-01)', () => {
  expect(
    calc({
      method: 'year',
      state: { vehicle: 'motorcycle', approval: '2020-09-30', ccm: '1000' },
    }),
  ).toBe(300.0);
});

test('Motorcycle Combustion 2020-10-01', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'motorcycle',
        approval: '2020-10-01',
        ccm: '1000',
        co2: '100',
      },
    }),
  ).toBe(22.87);
});

test('Motorcycle Combustion 2024-01-01', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'motorcycle',
        approval: '2024-01-01',
        ccm: '1000',
        co2: '100',
      },
    }),
  ).toBe(22.87);
});

test('Motorcycle Combustion 2024-01-01', () => {
  expect(
    calc({
      method: 'year',
      state: {
        vehicle: 'motorcycle',
        approval: '2024-01-01',
        ccm: '1000',
        co2: '100',
      },
    }),
  ).toBe(274.46);
});

test('Motorcycle Electric 2024-01-01', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'motorcycle',
        transmission: 'electric',
        approval: '2024-01-01',
        kw: '30',
      },
    }),
  ).toBe(12.5);
});

test('Motorcycle Electric 2024-01-01', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'motorcycle',
        transmission: 'electric',
        approval: '2024-01-01',
        kw: '9',
      },
    }),
  ).toBe(2);
});
