import { BoardProps } from '@cloudscape-design/board-components';

import {
  StoredWidgetPlacement,
  WidgetConfig,
  WidgetDataType,
} from '../../../utils/widget-types';

import { budgetTableWidget } from './budget-table';
import { incomeSourcesWidget } from './income-sources';
import { monthlyBreakdownWidget } from './monthly-breakdown';
import { monthlyOverviewWidget } from './monthly-overview';

const allWidgets: Record<string, WidgetConfig> = {
  monthlyOverviewWidget,
  incomeSourcesWidget,
  monthlyBreakdownWidget,
  budgetTableWidget,
};

export const getBoardWidgets = (layout: ReadonlyArray<StoredWidgetPlacement>) => {
  return layout.map((position) => {
    const widget = allWidgets[position.id];

    return {
      ...position,
      ...widget,
      columnOffset:
        position.columnOffset ?? (widget.columnOffset as { [columns: number]: number }),
      columnSpan: position.columnSpan ?? widget.definition?.defaultColumnSpan ?? 1,
      rowSpan: position.rowSpan ?? widget.definition?.defaultRowSpan ?? 1,
    };
  });
};

export const exportLayout = (
  items: ReadonlyArray<BoardProps.Item<WidgetDataType>>
): ReadonlyArray<StoredWidgetPlacement> => {
  return items.map((item) => ({
    id: item.id,
    columnSpan: item.columnSpan,
    columnOffset: item.columnOffset,
    rowSpan: item.rowSpan,
  }));
};
