import { BoardProps } from '@cloudscape-design/board-components';
import { StoredWidgetPlacement, WidgetConfig, WidgetDataType } from '../types';
import { widgetOne } from './widget-1';
import { widgetTwo } from './widget-2';

const allWidgets: Record<string, WidgetConfig> = {
  widgetOne,
  widgetTwo,
};

export const getBoardWidgets = (layout: ReadonlyArray<StoredWidgetPlacement>) => {
  return layout.map((position) => {
    const widget = allWidgets[position.id];

    return {
      ...position,
      ...widget,
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
