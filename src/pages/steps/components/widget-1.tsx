import { Box } from '@cloudscape-design/components';
import { WidgetConfig } from '../types';

// eslint-disable-next-line react-refresh/only-export-components
const WidgetOne = () => {
  return <Box variant='span'>Widget 1 body!</Box>;
};

export const widgetOne: WidgetConfig = {
  definition: { defaultRowSpan: 1, defaultColumnSpan: 1 },
  data: {
    title: 'Widget 1 title!',
    description: 'Widget 1 description.',
    content: <WidgetOne />,
  },
};
