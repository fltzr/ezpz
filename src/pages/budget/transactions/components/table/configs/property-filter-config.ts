import { PropertyFilterProps } from '@cloudscape-design/components';

const numberAndDateOperators = ['<', '<=', '>', '>='];
const stringOperators = [':', '!:', '=', '!=', '^', '^!'];
const selectOperators = ['=', '!='];

export const FILTERING_PROPERTIES: PropertyFilterProps.FilteringProperty[] = [
  {
    key: 'transaction_date',
    propertyLabel: 'Transaction date',
    groupValuesLabel: 'Transaction date values',
    operators: numberAndDateOperators.map((op) => ({
      operator: op,
    })),
  },
  {
    key: 'category',
    propertyLabel: 'Category',
    groupValuesLabel: 'Category values',
    operators: selectOperators,
  },
  {
    key: 'memo',
    propertyLabel: 'Memo',
    groupValuesLabel: 'Memo values',
    operators: stringOperators,
  },
  {
    key: 'outflow',
    propertyLabel: 'Outflow',
    groupValuesLabel: 'Outflow values',
    operators: numberAndDateOperators,
  },
];
