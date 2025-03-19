const l10n = {
  de: {
    title: 'Motorbezogene Versicherungssteuer Österreich',
    car: 'PKW',
    motorcycle: 'Motorrad',
    transporter: 'Klein-LKW (bis 3,5t)',
    label_transmission: 'Antriebsart',
    combustion: 'Verbrenner',
    electric: 'Elektro (BEV)',
    hybrid: 'Plug-in Hybrid (PHEV)',
    label_vehicle: 'Art des Fahrzeugs',
    label_approval: 'Erstzulassung (Zulassungsschein Zeile B)',
    label_kw: 'KW',
    label_ccm: 'ccm',
    label_co2: 'CO₂-Ausstoß',
    label_weight: 'Gewicht',
    placeholder_kw: 'Leistung in kW (Zulassungsschein Zeile P2)',
    placeholder_ccm: 'Hubraum in ccm',
    placeholder_co2: 'CO2-Wert (Zulassungsschein Zeile A24)',
    placeholder_weight: 'Eigengewicht in kg (Zulassungsschein Zeile G)',
    payment_method: 'Zahlweise',
    month: 'monatlich',
    three_month: 'vierteljährlich',
    half_year: 'halbjährlich',
    year: 'jährlich',
    choose: 'Bitte wählen Sie ...',
    toSep2020: 'bis 30.09.2020',
    fromOct2020ToEnd2020: 'ab 01.10.2020 bis 31.12.2020',
    fromStart2021ToEnd2021: 'ab 01.01.2021 bis 31.12.2021',
    fromStart2022ToEnd2022: 'ab 01.01.2022 bis 31.12.2022',
    fromStart2023ToEnd2023: 'ab 01.01.2023 bis 31.12.2023',
    fromStart2024ToEnd2024: 'ab 01.01.2024 bis 31.12.2024',
    fromStart2025ToEnd2025: 'ab 01.01.2025 bis 31.12.2025 *',
    fromStart2026ToEnd2026: 'ab 01.01.2026 bis 31.12.2026 *',
    disclaimer: 'Ohne Gewähr.',
  },
  en: {
    title: 'Vehicle Tax Calculation Austria',
    car: 'Car',
    motorcycle: 'Motorbike',
    transporter: 'Transporter (up to 3.5t)',
    label_transmission: 'Type of drive',
    combustion: 'Combustion engine',
    electric: 'Electric (BEV)',
    hybrid: 'Plug-in Hybrid (PHEV)',
    label_vehicle: 'Type of vehicle',
    label_approval: 'Registration of the vehicle for the first time',
    label_kw: 'KW',
    label_ccm: 'ccm',
    label_co2: 'CO₂ emissions',
    label_weight: 'Weight',
    placeholder_kw: 'Power in kW',
    placeholder_ccm: 'Cubic capacity in ccm',
    placeholder_co2: 'CO₂ value',
    placeholder_weight: 'Unladen weight in kg',
    payment_method: 'Method of payment',
    month: 'monthly',
    three_month: 'quarterly',
    half_year: 'half-yearly',
    year: 'yearly',
    choose: 'Please select ...',
    toSep2020: 'until 30.09.2020',
    fromOct2020ToEnd2020: 'from 01.10.2020 until 31.12.2020',
    fromStart2021ToEnd2021: 'from 01.01.2021 until 31.12.2021',
    fromStart2022ToEnd2022: 'from 01.01.2022 until 31.12.2022',
    fromStart2023ToEnd2023: 'from 01.01.2023 until 31.12.2023',
    fromStart2024ToEnd2024: 'from 01.01.2024 until 31.12.2024',
    fromStart2025ToEnd2025: 'from 01.01.2025 until 31.12.2025 *',
    fromStart2026ToEnd2026: 'from 01.01.2026 until 31.12.2026 *',
    disclaimer: 'Without guarantee.',
  },
};

const getUserLanguage = () =>
  document.documentElement.lang?.substring(0, 2) ||
  navigator.language?.substring(0, 2) ||
  'en';

export const lang = getUserLanguage();

export const $t = (string, fallback) =>
  l10n[lang]?.[string]
    ? l10n[lang][string]
    : fallback
    ? fallback
    : `[${string}]`;
