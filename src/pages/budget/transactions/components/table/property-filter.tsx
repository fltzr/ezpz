import { UseCollectionResult } from '@cloudscape-design/collection-hooks';
import { PropertyFilter } from '@cloudscape-design/components';

export const TablePropertyFilter = (
  propertyFilterProps: UseCollectionResult<unknown>['propertyFilterProps']
) => {
  return <PropertyFilter {...propertyFilterProps} />;
};
