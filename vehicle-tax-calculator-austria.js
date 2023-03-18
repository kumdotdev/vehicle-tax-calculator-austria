import { LitElement, html } from 'https://cdn.skypack.dev/lit?min';

const MIN_CAR_TAX = 7.2;
const MIN_MOTORCYCLE_TAX = 2.0;
const YEAR_BASE = 2020;
const DATE_2020_10_01 = new Date('2020-10-01');

const years = [2023];
const payments = {
  month: [1, 1.1],
  three_month: [3, 1.08],
  half: [6, 1.06],
  full: [12, 1.0],
};
const approvalDates = {
  choose: null,
  toSep2020: '2020-09-30',
  fromOct2020ToEnd2020: '2020-10-01',
  fromStart2021ToEnd2021: '2021-01-01',
  fromStart2022ToEnd2022: '2022-01-01',
  fromStart2023ToEnd2023: '2023-01-01',
  fromStart2024ToEnd2024: '2024-01-01',
};

const getUserLanguage = () =>
  document.documentElement.lang?.substring(0, 2) ||
  navigator.language?.substring(0, 2) ||
  'en';

const lang = getUserLanguage();

const l10n = {
  de: {
    title: 'Motorbezogene Versicherungssteuer',
    car: 'PKW',
    motorcycle: 'Motorrad',
    label_approval: 'Erstmalige Zulassung des Fahrzeugs',
    label_kw: 'KW',
    label_ccm: 'ccm',
    label_co2: 'CO₂-Ausstoß',
    placeholder_kw: 'Leistung in kW',
    placeholder_ccm: 'Hubraum in ccm',
    placeholder_co2: 'CO₂-Wert',
    payment_method: 'Zahlweise',
    month: 'monatlich',
    three_month: 'vierteljährlich',
    half: 'halbjährlich',
    full: 'jährlich',
    choose: 'Bitte wählen Sie ...',
    toSep2020: 'bis 30.09.2020',
    fromOct2020ToEnd2020: 'ab 01.10.2020 bis 31.12.2020',
    fromStart2021ToEnd2021: 'ab 01.01.2021 bis 31.12.2021',
    fromStart2022ToEnd2022: 'ab 01.01.2022 bis 31.12.2022',
    fromStart2023ToEnd2023: 'ab 01.01.2023 bis 31.12.2023',
    fromStart2024ToEnd2024: 'ab 01.01.2024 bis 31.12.2024',
    disclaimer: 'Ohne Gewähr.',
  },
};

const trl = (string, fallback) =>
  l10n[lang]?.[string] ? l10n[lang][string] : fallback ? fallback : string;

class TaxCalculator extends LitElement {
  static get properties() {
    return {
      approval: { type: String },
      kw: { type: Number },
      ccm: { type: Number },
      co2: { type: Number },
      vehicle: { type: String },
    };
  }

  constructor() {
    super();
    this.approval = '';
    this.kw = '';
    this.ccm = '';
    this.co2 = '';
    this.vehicle = 'car';
  }

  calc(year) {
    switch (this.vehicle) {
      case 'car':
        return new Date(this.approval) < DATE_2020_10_01
          ? this.calculateTaxCarOld(year)
          : this.calculateTaxCar(year);
      case 'motorcycle':
        return new Date(this.approval) < DATE_2020_10_01
          ? this.calculateTaxMotorcycleOld()
          : this.calculateTaxMotorcycle();
      default:
        return null;
    }
  }

  calculateTaxCar(year) {
    if (!this.kw || !this.co2) return null;
    if (this.approval === '') return null;
    if (year === 2020) year = 2021;
    return (
      Math.max((this.kw - 65 + (year - YEAR_BASE)) * 0.72, MIN_CAR_TAX / 2) +
      Math.max(
        (this.co2 - 115 + (year - YEAR_BASE) * 3) * 0.72,
        MIN_CAR_TAX / 2,
      )
    );
  }

  calculateTaxCarOld() {
    const { min, max } = Math;
    if (!this.kw) return null;
    if (this.approval === '') return null;
    return max(
      6.2,
      min(max(0, this.kw - 24), 66) * 0.62 +
        min(max(0, this.kw - 24 - 66), 20) * 0.66 +
        max(this.kw - 24 - 66 - 20, 0) * 0.75,
    );
  }

  calculateTaxMotorcycle() {
    if (!this.ccm || !this.co2) return null;
    if (this.ccm <= 100) return null;
    if (this.approval === '') return null;
    return (
      Math.max((this.ccm - 52) * 0.014, 0) +
      Math.max((this.co2 - 52) * 0.2, MIN_MOTORCYCLE_TAX)
    );
  }

  calculateTaxMotorcycleOld() {
    if (!this.ccm || this.ccm <= 100) return null;
    if (this.approval === '') return null;
    return this.ccm * 0.025;
  }

  powerInput() {
    switch (this.vehicle) {
      case 'car':
        return html`
          <label>${trl('label_kw')}</label>
          <input
            type="number"
            inputmode="numeric"
            name="kw"
            min="0"
            placeholder=${trl('placeholder_kw')}
            .value=${this.kw}
            ?disabled=${this.approval === ''}
            @change=${this.onChange}
            @keyup=${this.onChange}
          />
        `;
      case 'motorcycle':
        return html`
          <label>${trl('label_ccm')}</label>
          <input
            type="number"
            inputmode="numeric"
            name="ccm"
            min="0"
            placeholder=${trl('placeholder_ccm')}
            .value=${this.ccm}
            ?disabled=${this.approval === ''}
            @change=${this.onChange}
            @keyup=${this.onChange}
          />
        `;
    }
  }

  approvalInput() {
    return html`
      <div>
        <div>
          <label>${trl('label_approval')}</label>
          <select
            name="approval"
            @change=${this.onChange}
          >
            ${Object.entries(approvalDates).map(
              ([key, value]) => html` <option
                ?selected=${value === this.approval}
                value="${value}"
              >
                ${trl(key)}
              </option>`,
            )}
          </select>
        </div>
      </div>
    `;
  }

  radioButtons() {
    return html`
      <div>
        <input
          type="radio"
          id="car"
          name="vehicle"
          value="car"
          .checked=${this.vehicle === 'car'}
          @change=${this.onChange}
        />
        <label for="car">
          <span>${trl('car')}</span>
        </label>
      </div>
      <div>
        <input
          type="radio"
          id="motorcycle"
          name="vehicle"
          value="motorcycle"
          .checked=${this.vehicle === 'motorcycle'}
          @change=${this.onChange}
        />
        <label for="motorcycle">
          <span>${trl('motorcycle')}</span>
        </label>
      </div>
    `;
  }

  taxRows() {
    const rows = [];
    Object.entries(payments).forEach(([key, value]) => {
      rows.push(html`
        <tr>
          <th>${trl(key)}</th>
          ${years.map(
            (year) => html`
              <td>
                ${this.calc(new Date(this.approval).getFullYear())
                  ? (
                      this.calc(new Date(this.approval).getFullYear()) *
                      value[0] *
                      (new Date(this.approval) < DATE_2020_10_01 ? value[1] : 1)
                    ).toLocaleString('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    })
                  : new Number().toLocaleString('de-DE', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
              </td>
            `,
          )}
        </tr>
      `);
    });
    return rows;
  }

  taxTable() {
    return html`
      <div>
        <table>
          <thead>
            <tr>
              <th>${trl('payment_method')}</th>
              ${years.map((year) => html` <th>${year}</th> `)}
            </tr>
          </thead>
          <tbody>
            ${this.taxRows()}
          </tbody>
        </table>
      </div>
    `;
  }

  onChange(event) {
    this[event.target.name] = event.target.value;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <h2>${trl('title', 'Choose vehicle')}</h2>
      <div>
        <div>
          <form>
            ${this.radioButtons()} ${this.approvalInput()}
            <div>
              <div>${this.powerInput()}</div>
              <div>
                <label> ${trl('label_co2')} </label>
                <input
                  type="number"
                  inputmode="numeric"
                  name="co2"
                  min="0"
                  placeholder=${trl('placeholder_co2')}
                  .value=${new Date(this.approval) < DATE_2020_10_01
                    ? ''
                    : this.co2}
                  ?disabled=${this.approval === '' ||
                  new Date(this.approval) < DATE_2020_10_01}
                  @change=${this.onChange}
                  @keyup=${this.onChange}
                />
              </div>
            </div>
          </form>
        </div>
        <div>
          ${this.taxTable()}
          <p>
            <small> ${trl('disclaimer')} </small>
          </p>
        </div>
      </div>
    `;
  }
}

customElements.define('vehicle-tax-calculator-austria', TaxCalculator);
