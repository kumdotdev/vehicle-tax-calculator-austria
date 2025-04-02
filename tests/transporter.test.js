import { expect, test } from 'vitest';
import { calc } from '../src/calculations.js';

test('Transporter Combustion 2020-09-30', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'transporter',
        transmission: 'combustion',
        approval: '2020-09-30',
        kw: '85',
      },
    }),
  ).toBe(41.6);
});

test('Transporter Hybrid 2020-09-30', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'transporter',
        transmission: 'hybrid',
        approval: '2020-09-30',
        kw: '85',
      },
    }),
  ).toBe(41.6);
});

test('Transporter Combustion 2024-01-01', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'transporter',
        approval: '2024-01-01',
        kw: '100',
        co2: '100',
      },
    }),
  ).toBe(49.9);
});

test('Transporter Electric 2024-01-01', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'transporter',
        transmission: 'electric',
        approval: '2024-01-01',
        kw: '100',
      },
    }),
  ).toBe(55.5);
});

test('Transporter Electric 2024-01-01', () => {
  expect(
    calc({
      method: 'year',
      state: {
        vehicle: 'transporter',
        transmission: 'electric',
        approval: '2024-01-01',
        kw: '100',
      },
    }),
  ).toBe(666);
});

test('Transporter Combustion 2020-09-30', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'transporter',
        transmission: 'combustion',
        approval: '2020-09-30',
        kw: '0',
      },
    }),
  ).toBe(6.82);
});

test('Transporter Combustion 2019-09-30', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'transporter',
        transmission: 'combustion',
        approval: '2019-09-30',
        kw: '250',
      },
    }),
  ).toBe(79.20);
});

test('Transporter Electric 2024-01-01', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'transporter',
        transmission: 'electric',
        approval: '2024-01-01',
        kw: '0',
      },
    }),
  ).toBe(6.5);
});

test('Transporter Electric 2024-01-01', () => {
  expect(
    calc({
      method: 'month',
      state: {
        vehicle: 'transporter',
        transmission: 'electric',
        approval: '2024-01-01',
        kw: '1000',
      },
    }),
  ).toBe(76);
});
