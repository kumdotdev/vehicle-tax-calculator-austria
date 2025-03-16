import { LitElement, html } from 'https://cdn.skypack.dev/lit?min';
import { renderForm } from './src/form.js';
import { calc, DATE_2020_10_01, PAYMENT_METHODS } from './src/calculations.js';
import { $t, lang } from './src/l10n.js';

const VEHICLES = [
  {
    type: 'car',
    transmissions: ['combustion', 'electric', 'hybrid'],
  },
  {
    type: 'motorcycle',
    transmissions: ['combustion', 'electric'],
  },
  {
    type: 'transporter',
    transmissions: ['combustion', 'electric', 'hybrid'],
  },
];

const APPROVAL_DATES = {
  toSep2020: '2020-09-30',
  fromOct2020ToEnd2020: '2020-10-01',
  fromStart2021ToEnd2021: '2021-01-01',
  fromStart2022ToEnd2022: '2022-01-01',
  fromStart2023ToEnd2023: '2023-01-01',
  fromStart2024ToEnd2024: '2024-01-01',
  fromStart2025ToEnd2025: '2025-01-01',
  fromStart2026ToEnd2026: '2026-01-01',
};

const formDefinition = [
  {
    type: 'radio',
    options: VEHICLES.map((vehicle) => ({
      val: vehicle.type,
      text: $t(vehicle.type),
    })),
    name: 'vehicle',
    value: '',
    label: $t('label_vehicle'),
  },
  ...VEHICLES.map((vehicle) => {
    return {
      type: 'select',
      name: 'transmission',
      value: '',
      options: vehicle.transmissions.map((transmission) => ({
        val: transmission,
        text: $t(transmission),
      })),
      label: $t(`label_transmission`),
      depConditionsTrueIf: 'all',
      conditionalLogic: [
        {
          depFieldName: 'vehicle',
          depFieldValue: vehicle.type,
          depFieldValueCondition: '=',
        },
      ],
    };
  }),
  {
    type: 'select',
    options: Object.entries(APPROVAL_DATES).map(([key, value]) => ({
      val: value,
      text: $t(key),
    })),
    name: 'approval',
    value: '',
    label: $t('label_approval'),
    depConditionsTrueIf: 'any',
    conditionalLogic: [
      {
        depFieldName: 'transmission',
        depFieldValue: '',
        depFieldValueCondition: 'NotEmpty',
        andGroup: [
          {
            depFieldName: 'transmission',
            depFieldValue: 'electric',
            depFieldValueCondition: '!=',
          },
        ],
      },
    ],
  },
  {
    type: 'number',
    name: 'kw',
    value: '',
    label: $t('label_kw'),
    placeholder: $t('placeholder_kw'),
    depConditionsTrueIf: 'any',
    conditionalLogic: [
      {
        depFieldName: 'vehicle',
        depFieldValue: 'car',
        depFieldValueCondition: '=',
        andGroup: [
          {
            depFieldName: 'transmission',
            depFieldValue: '',
            depFieldValueCondition: 'NotEmpty',
          },
        ],
      },
      {
        depFieldName: 'vehicle',
        depFieldValue: 'transporter',
        depFieldValueCondition: '=',
        andGroup: [
          {
            depFieldName: 'transmission',
            depFieldValue: '',
            depFieldValueCondition: 'NotEmpty',
          },
        ],
      },
      {
        depFieldName: 'vehicle',
        depFieldValue: 'motorcycle',
        depFieldValueCondition: '=',
        andGroup: [
          {
            depFieldName: 'transmission',
            depFieldValue: 'electric',
            depFieldValueCondition: '=',
          },
        ],
      },
    ],
  },
  {
    type: 'number',
    name: 'ccm',
    value: '',
    label: $t('label_ccm'),
    placeholder: $t('placeholder_ccm'),
    depConditionsTrueIf: 'any',
    conditionalLogic: [
      {
        depFieldName: 'vehicle',
        depFieldValue: 'motorcycle',
        depFieldValueCondition: '=',
        andGroup: [
          {
            depFieldName: 'transmission',
            depFieldValue: '',
            depFieldValueCondition: 'NotEmpty',
          },
          {
            depFieldName: 'transmission',
            depFieldValue: 'electric',
            depFieldValueCondition: '!=',
          },
        ],
      },
    ],
  },
  {
    type: 'number',
    name: 'co2',
    value: '',
    label: $t('label_co2'),
    placeholder: $t('placeholder_co2'),
    depConditionsTrueIf: 'any',
    conditionalLogic: [
      {
        depFieldName: 'transmission',
        depFieldValue: 'combustion',
        depFieldValueCondition: '=',
        andGroup: [
          {
            depFieldName: 'approval',
            depFieldValue: DATE_2020_10_01,
            depFieldValueCondition: '[DATE lte]',
          },
        ],
      },
      {
        depFieldName: 'transmission',
        depFieldValue: 'hybrid',
        depFieldValueCondition: '=',
        andGroup: [
          {
            depFieldName: 'approval',
            depFieldValue: DATE_2020_10_01,
            depFieldValueCondition: '[DATE lte]',
          },
        ],
      },
    ],
  },
  {
    type: 'number',
    name: 'weight',
    value: '',
    label: $t('label_weight'),
    placeholder: $t('placeholder_weight'),
    depConditionsTrueIf: 'any',
    conditionalLogic: [
      {
        depFieldName: 'vehicle',
        depFieldValue: 'car',
        depFieldValueCondition: '=',
        andGroup: [
          {
            depFieldName: 'transmission',
            depFieldValue: 'electric',
            depFieldValueCondition: '=',
          },
        ],
      },
    ],
  },
];

class TaxCalculator extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();
    this.state = formDefinition.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});
    console.log('Initial state: ', this.state);
  }

  createRenderRoot() {
    return this;
  }

  handleChange(event) {
    this.state[event.target.name] = event.target.value;

    // this conditional fixes transition from
    // transmission 'hybrid' to vehicle 'motorcycle'
    // that does not contain this type of transmission
    if (
      this.state.vehicle === 'motorcycle' &&
      this.state.transmission === 'hybrid'
    )
      this.state.transmission = '';

    this.requestUpdate();
    console.log('state: ', this.state);
  }

  renderTaxTable({ state }) {
    return html`
      <table>
        <thead>
          <tr>
            <th>${$t('payment_method')}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(PAYMENT_METHODS).map((key) => {
            return html`
              <tr>
                <td>${$t(key)}</td>
                <td>
                  ${calc({ method: key, state })?.toLocaleString(lang, {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </td>
              </tr>
            `;
          }, {})}
        </tbody>
      </table>
    `;
  }

  render() {
    return html`
      <h1>${$t('title', 'Vehicle Tax Calculation Austria')}</h1>
      ${renderForm({
        formDefinition,
        state: this.state,
        handleChange: this.handleChange,
      })}
      ${this.renderTaxTable({ state: this.state })}
      <p>
        <small> ${$t('disclaimer')} </small>
      </p>
    `;
  }
}

customElements.define('vehicle-tax-calculator-austria', TaxCalculator);
