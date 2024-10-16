import {
  CollectionPreferences,
  CollectionPreferencesProps,
} from '@cloudscape-design/components';

type PreferencesProps = {
  preferences: CollectionPreferencesProps['preferences'];
  setPreferences: (config: CollectionPreferencesProps['preferences']) => void;
  pageSizeOptions?: CollectionPreferencesProps.PageSizePreference['options'];
  contentDisplayOptions?: CollectionPreferencesProps.ContentDisplayPreference['options'];
  disabled?: boolean;
};

export const Preferences = ({
  preferences,
  setPreferences,
  disabled,
}: PreferencesProps) => {
  console.log(JSON.stringify(preferences, null, 2));

  return (
    <CollectionPreferences
      disabled={disabled}
      preferences={preferences}
      onConfirm={({ detail }) => setPreferences?.(detail)}
      wrapLinesPreference={{}}
      stripedRowsPreference={{}}
      contentDensityPreference={{}}
      stickyColumnsPreference={{
        firstColumns: {
          title: 'Stick first column(s)',
          description:
            'Keep the first column(s) visible while horizontally scrolling the table content.',
          options: [
            { label: 'None', value: 0 },
            { label: 'First column', value: 1 },
            { label: 'First two columns', value: 2 },
          ],
        },
      }}
    />
  );
};
