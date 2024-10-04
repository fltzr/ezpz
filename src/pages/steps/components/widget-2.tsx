import { Box } from '@cloudscape-design/components';
import { WidgetConfig } from '../types';

// eslint-disable-next-line react-refresh/only-export-components
const WidgetTwo = () => {
  return <Box variant='span'>Widget 2!</Box>;
};

export const widgetTwo: WidgetConfig = {
  definition: { defaultRowSpan: 2, defaultColumnSpan: 2 },
  data: {
    title: 'Widget 2!',
    description: 'Widget 2 description.',
    content: <WidgetTwo />,
  },
};
