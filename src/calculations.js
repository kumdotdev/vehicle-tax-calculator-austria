import {
  min,
  max,
  getDate,
  getYear,
  isValidDate,
  roundToTwoDecimals,
} from './utils.js';

export const DATE_2020_10_01 = getDate('2020-10-01');

// base used for calculation of car taxes with combustion engine
const YEAR_BASE = 2020;

// used only for approval dates before 2020-10-01
const MONTHLY_PAYMENT_RATE = 1.1; // +10%
const QUATERLY_PAYMENT_RATE = 1.08; // +8%
const HALF_YEARLY_PAYMENT_RATE = 1.06; // +6%
const YEARLY_PAYMENT_RATE = 1; // no charge

// chargeRate used only for approval dates before 2020-10-01
export const PAYMENT_METHODS = {
  month: { monthsCount: 1, chargeRate: MONTHLY_PAYMENT_RATE },
  three_month: { monthsCount: 3, chargeRate: QUATERLY_PAYMENT_RATE },
  half_year: { monthsCount: 6, chargeRate: HALF_YEARLY_PAYMENT_RATE },
  year: { monthsCount: 12, chargeRate: YEARLY_PAYMENT_RATE },
};

const DEDUCTION_VALUES_FOR_PLUG_IN_HYBRIDS = {
  2020: { kw: 65, co2: 17 },
  2021: { kw: 64, co2: 16 },
  2022: { kw: 63, co2: 15 },
  2023: { kw: 62, co2: 14 },
  2024: { kw: 61, co2: 13 },
  2025: { kw: 60, co2: 12 },
  2026: { kw: 59, co2: 24 },
  2027: { kw: 58, co2: 24 },
  2028: { kw: 57, co2: 36 },
  2029: { kw: 56, co2: 35 },
  2030: { kw: 55, co2: 34 },
  2031: { kw: 54, co2: 33 },
  2032: { kw: 53, co2: 32 },
};

export const calc = ({ method, state = {} }) => {
  const { approval, vehicle, transmission } = state;
  const year = getYear(approval);
  switch (vehicle) {
    case 'car':
      if (transmission === 'electric') {
        return calculateTaxCarElectric({ method, year, state });
      }
      if (transmission === 'hybrid') {
        return calculateTaxCarHybrid({ method, year, state });
      }
      return getDate(approval) < DATE_2020_10_01
        ? calculateTaxCarOld({ method, year, state })
        : calculateTaxCar({ method, year, state });
    case 'motorcycle':
      if (transmission === 'electric') {
        return calculateTaxMotorcycleElectric({ method, state });
      }
      return getDate(approval) < DATE_2020_10_01
        ? calculateTaxMotorcycleOld({ method, state })
        : calculateTaxMotorcycle({ method, state });
    case 'transporter':
      if (transmission === 'electric') {
        return calculateTaxTransporterElectric({ method, state });
      }
      return calculateTaxTransporter({ method, state });
    default:
      return null;
  }
};

const calculateTaxCar = ({ method, year, state }) => {
  const { kw, co2, approval } = state;
  if (!kw || !co2) return null;
  if (approval === '') return null;
  return roundToTwoDecimals(
    (max((kw - 65 + (year - YEAR_BASE)) * 0.72, 7.2 / 2) +
      max((co2 - 115 + (year - YEAR_BASE) * 3) * 0.72, 7.2 / 2)) *
      PAYMENT_METHODS[method].monthsCount,
  );
};

const calculateTaxCarOld = ({ method, state }) => {
  const { kw, approval } = state;
  if (!kw) return null;
  if (approval === '') return null;
  return roundToTwoDecimals(
    max(
      6.2,
      min(max(0, kw - 24), 66) * 0.62 +
        min(max(0, kw - 24 - 66), 20) * 0.66 +
        max(kw - 24 - 66 - 20, 0) * 0.75,
    ) *
      PAYMENT_METHODS[method].chargeRate *
      PAYMENT_METHODS[method].monthsCount,
  );
};

const calculateTaxCarHybrid = ({ method, year, state }) => {
  const { kw, co2, approval } = state;
  console.log(year);

  if (!kw || !co2) return null;
  return roundToTwoDecimals(
    (max(kw - DEDUCTION_VALUES_FOR_PLUG_IN_HYBRIDS[year].kw, 5) * 0.72 +
      max(co2 - DEDUCTION_VALUES_FOR_PLUG_IN_HYBRIDS[year].co2, 5) * 0.72) *
      PAYMENT_METHODS[method].monthsCount,
  );
};

const calculateTaxCarElectric = ({ method, state }) => {
  const { kw, weight } = state;

  if (!kw || !weight) return null;

  const reducedKw = max(kw - 45, 0);
  const first35Kw = min(reducedKw, 35);
  const next25Kw = min(max(reducedKw - 35, 0), 25);
  const remainingKw = max(reducedKw - 35 - 25, 0);

  const taxFirst35Kw = max(first35Kw * 0.25, 2.5);
  const taxNext25Kw = next25Kw * 0.35;
  const taxRemainingKw = remainingKw * 0.45;

  const reducedWeight = max(weight - 900, 0);
  const first500Weight = min(reducedWeight, 500);
  const next700Weight = min(max(reducedWeight - 500, 0), 700);
  const remainingWeight = max(reducedWeight - 500 - 700, 0);

  const taxFirst500Weight = max(first500Weight * 0.015, 3.0);
  const taxNext700Weight = next700Weight * 0.03;
  const taxRemainingWeight = remainingWeight * 0.045;

  return roundToTwoDecimals(
    (taxFirst35Kw +
      taxNext25Kw +
      taxRemainingKw +
      taxFirst500Weight +
      taxNext700Weight +
      taxRemainingWeight) *
      PAYMENT_METHODS[method].monthsCount,
  );
};

export const calculateTaxMotorcycle = ({ method, state }) => {
  const { ccm, co2, approval } = state;
  if (!ccm || !co2) return null;
  if (ccm <= 100) return null;
  if (approval === '') return null;
  return roundToTwoDecimals(
    (max((ccm - 52) * 0.014, 0) + max((co2 - 52) * 0.2, 2.0)) *
      PAYMENT_METHODS[method].monthsCount,
  );
};

export const calculateTaxMotorcycleOld = ({ method, state }) => {
  const { ccm, approval } = state;
  if (!ccm || ccm <= 100) return null;
  if (approval === '') return null;
  return roundToTwoDecimals(
    ccm *
      0.025 *
      PAYMENT_METHODS[method].chargeRate *
      PAYMENT_METHODS[method].monthsCount,
  );
};

export const calculateTaxMotorcycleElectric = ({ method, state }) => {
  const { kw } = state;
  if (!kw) return null;
  const reducedKw = max(kw - 5, 0);
  return roundToTwoDecimals(
    max(reducedKw * 0.5, 2) * PAYMENT_METHODS[method].monthsCount,
  );
};

export const calculateTaxTransporter = ({ method, state }) => {
  const { approval, kw } = state;
  if (!kw) return null;
  if (approval === '') return null;
  return roundToTwoDecimals(
    max(
      6.2,
      min(
        76.0,
        min(max(0, kw - 24), 66) * 0.65 +
          min(max(0, kw - 24 - 66), 20) * 0.7 +
          max(kw - 24 - 66 - 20, 0) * 0.79,
      ),
    ) *
      PAYMENT_METHODS[method].monthsCount *
      (getDate(approval) < DATE_2020_10_01
        ? PAYMENT_METHODS[method].chargeRate
        : 1),
  );
};

const calculateTaxTransporterElectric = ({ method, state }) => {
  const { kw } = state;
  if (!kw) return null;

  const reducedKw = max(kw - 16, 0);
  const first66Kw = min(reducedKw, 66);
  const next20Kw = min(max(reducedKw - 66, 0), 20);
  const remainingKw = max(reducedKw - 66 - 20, 0);

  const taxFirst66Kw = max(first66Kw * 0.65, 0);
  const taxNext20Kw = next20Kw * 0.7;
  const taxRemainingKw = remainingKw * 0.79;

  return roundToTwoDecimals(
    min(max(taxFirst66Kw + taxNext20Kw + taxRemainingKw, 6.5), 76) *
      PAYMENT_METHODS[method].monthsCount,
  );
};
