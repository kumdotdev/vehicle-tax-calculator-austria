import { html } from 'https://cdn.skypack.dev/lit?min';
import { $t } from './l10n.js';
import { passesConditionalLogic } from './utils.js';

// https://devmarvels.com/creating-conditional-form-fields-with-react-hook-form-and-typescript/

export const renderForm = ({ formDefinition, state, handleChange }) => {
  return html` <form>
    ${formDefinition.map((field) =>
      renderDynamicField({ field, state, handleChange }),
    )}
  </form>`;
};

const renderDynamicField = ({ field, state, handleChange }) => {
  const { name, conditionalLogic, depConditionsTrueIf } = field;
  const passes = passesConditionalLogic({
    name,
    conditionalLogic,
    logicTrueIf: depConditionsTrueIf,
    watchList: state,
  });

  if (!passes) {
    return;
  }

  switch (field.type) {
    case 'radio':
      return html`
        <fieldset>
          <legend>${field.label}</legend>
          <div>
            ${field.options.map(
              (option) => html`
                <input
                  type="radio"
                  id=${option.val}
                  name=${field.name}
                  value=${option.val}
                  .checked=${state[field.name] === option.val}
                  @change=${handleChange}
                />
                <label for=${option.val}>${option.text}</label>
              `,
            )}
          </div>
        </fieldset>
      `;
    case 'select':
      return html`
        <div>
          <label>${field.label}</label>
          <select
            name=${field.name}
            @change=${handleChange}
          >
            <option
              ?selected=${'' === state[field.name]}
              value=""
            >
              ${$t('choose')}
            </option>
            ${field.options.map(
              (option) => html` <option
                ?selected=${option.val === state[field.name]}
                value=${option.val}
              >
                ${option.text}
              </option>`,
            )}
          </select>
        </div>
      `;
    case 'number':
      return html`
        <div>
          <label>${field.label}</label>
          <input
            type="number"
            name=${field.name}
            placeholder=${field.placeholder}
            .value=${state[field.name]}
            @change=${handleChange}
            @keyup=${handleChange}
          />
        </div>
      `;
  }
};
