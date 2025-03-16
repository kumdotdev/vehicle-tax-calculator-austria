export const { min, max, round } = Math;

export const roundToTwoDecimals = (number) => round(number * 1e2) / 1e2;
export const getDate = (date) => new Date(date);
export const getYear = (date) => new Date(date).getFullYear();
export const isValidDate = (date) => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

export const passesConditionalLogic = ({
  rootFieldName,
  conditionalLogic,
  logicTrueIf,
  watchList,
}) => {
  if (!conditionalLogic) {
    return true;
  }

  let andGroupMet = true;
  let res = true;
  let runningCond = true;
  const conditionType = logicTrueIf === 'any' ? 'any' : 'all';
  for (let i = 0; i < conditionalLogic.length; i += 1) {
    const condLogic = conditionalLogic[i];

    const fieldName = condLogic.depFieldName;
    const condOp = condLogic.depFieldValueCondition;
    const fieldValue = watchList[fieldName];
    const expectedValue = condLogic.depFieldValue;
    const andGroup = condLogic?.andGroup;

    // reset on each new condition, as we only need any condition to be true!
    if (conditionType === 'any') {
      andGroupMet = true;
    }

    res = evalConditionalLogic({ value: fieldValue, condOp, expectedValue });

    if (andGroup) {
      // only set runningCond initially when there is a andGroup
      if (i === 0) {
        runningCond = false;
      }
      for (let andGroupLogic of andGroup) {
        const andFieldName = andGroupLogic.depFieldName;
        const andCondOp = andGroupLogic.depFieldValueCondition;
        const andFieldValue = watchList[andFieldName];
        const andExpectedValue = andGroupLogic.depFieldValue;
        andGroupMet =
          andGroupMet &&
          evalConditionalLogic({
            value: andFieldValue,
            condOp: andCondOp,
            expectedValue: andExpectedValue,
          });
        if (!andGroupMet) {
          break;
        }
      }
    }

    if (conditionType === 'all') {
      runningCond = res && runningCond;
    } else if (conditionType === 'any') {
      if (andGroup) {
        runningCond = runningCond || (andGroupMet && res);
      } else {
        runningCond = res;
      }
      // if true, we found a condition that shows this field, no need to keep checking
      if (runningCond) {
        break;
      }
    }
  }
  return runningCond;
};

const evalConditionalLogic = ({ value, condOp, expectedValue }) => {
  let result;
  switch (condOp) {
    case 'NotEmpty':
      result = value?.length > 0;
      break;
    case '!=':
      result = value !== expectedValue;
      break;
    case '<':
      result = value < expectedValue;
      break;
    case '<=':
      result = value <= expectedValue;
      break;
    case '=':
      result = value === expectedValue;
      break;
    case '>':
      result = value > expectedValue;
      break;
    case '[DATE gte]':
      result = new Date(value) <= expectedValue;
      break;
    case '[DATE lte]':
      result = new Date(value) >= expectedValue;
      break;
    default:
      result = false;
  }
  return result;
};
