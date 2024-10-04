import { BoardProps } from '@cloudscape-design/board-components';
import { ReactNode } from 'react';

export type StoredWidgetPlacement = {
  id: string;
  columnOffset?: Record<number, number>;
  rowSpan?: number;
  columnSpan?: number;
};

export type WidgetDataType = {
  title: string;
  description: string;
  disableContentPaddings?: boolean;
  provider?: React.JSXElementConstructor<{ children: React.ReactElement }>;
  content?: ReactNode;
  actions?: ReactNode;
};

export type DashboardWidgetItem = BoardProps.Item<WidgetDataType>;
export type WidgetConfig = Pick<DashboardWidgetItem, 'definition' | 'data'>;
