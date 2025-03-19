import { expect, test } from 'vitest';
import { calc } from '../src/calculations.js';

test('Car Combustion 2020-09-30 (pre 2020-10-01) (100kw)', () => {
  expect(
    calc({
      method: 'month',
      state: { vehicle: 'car', approval: '2020-09-30', kw: '100' },
    }),
  ).toBe(52.27);
});

test('Car Combustion 2020-09-30 (pre 2020-10-01) (100kw) year', () => {
  expect(
    calc({
      method: 'year',
      state: { vehicle: 'car', approval: '2020-09-30', kw: '100' },
    }),
  ).toBe(570.24);
});

test('Car Combustion 2020-10-01 (100kw/100co2)', () => {
  expect(
    calc({
      method: 'month',
      state: { vehicle: 'car', approval: '2020-10-01', kw: '100', co2: '100' },
    }),
  ).toBe(28.8);
});

test('Car Combustion 2021-01-01 (100kw/100co2)', () => {
  expect(
    calc({
      method: 'month',
      state: { vehicle: 'car', approval: '2021-01-01', kw: '100', co2: '100' },
    }),
  ).toBe(29.52);
});

test('Car Combustion 2024-01-01 (100kw/100co2)', () => {
  expect(
    calc({
      method: 'month',
      state: { vehicle: 'car', approval: '2024-01-01', kw: '100', co2: '100' },
    }),
  ).toBe(31.68);
});

test('Car Electric 2024-01-01 (100kw/2000kg)', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'car',
        transmission: 'electric',
        approval: '2024-01-01',
        kw: '100',
        weight: '2000',
      },
    }),
  ).toBe(41.25);
});

test('Car Hybrid 2024-01-01 (100kw/100co2)', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'car',
        transmission: 'hybrid',
        approval: '2024-01-01',
        kw: '100',
        co2: '100',
      },
    }),
  ).toBe(90.72);
});

test('Car Hybrid 2024-01-01 (200kw/200co2)', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'car',
        transmission: 'hybrid',
        approval: '2024-01-01',
        kw: '200',
        co2: '200',
      },
    }),
  ).toBe(234.72);
});

test('Car Hybrid 2024-01-01 (60kw/10co2)', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'car',
        transmission: 'hybrid',
        approval: '2024-01-01',
        kw: '60',
        co2: '10',
      },
    }),
  ).toBe(7.2);
});

test('Car Hybrid 2020-09-30 (100kw)', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'car',
        transmission: 'hybrid',
        approval: '2020-09-30',
        kw: '100',
      },
    }),
  ).toBe(52.27);
});
