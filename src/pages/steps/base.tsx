import { useLocalStorage } from 'react-use';
import { Board, BoardItem } from '@cloudscape-design/board-components';
import { StoredWidgetPlacement } from './types';
import { boardI18nStrings, boardItemI18nStrings } from './i18n-strings';
import { EmptyBoard } from './components/empty';
import { exportLayout, getBoardWidgets } from './components/configurable-widget';
import { Header } from '@cloudscape-design/components';

const BaseSteps = () => {
  const [layout, setLayout] =
    useLocalStorage<ReadonlyArray<StoredWidgetPlacement> | null>(
      'Budget-Dashboard-Layout',
      null
    );

  return (
    <Board
      i18nStrings={boardI18nStrings}
      empty={<EmptyBoard />}
      items={getBoardWidgets(layout ?? [{ id: 'widgetOne' }, { id: 'widgetTwo' }])}
      onItemsChange={(event) => {
        setLayout(exportLayout(event.detail.items));
      }}
      renderItem={(item) => (
        <BoardItem
          i18nStrings={boardItemI18nStrings}
          header={<Header variant='h2'>{item.data.title}</Header>}>
          {item.data.content}
        </BoardItem>
      )}
    />
  );
};

export default BaseSteps;
