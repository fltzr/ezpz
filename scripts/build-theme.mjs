import path from 'path';
import fs from 'fs';
import { buildThemedComponents } from '@cloudscape-design/components-themeable';

const theme = {
  tokens: {
    colorBackgroundLayoutMain: {
      light: '#ffffff',
      dark: '#151d26',
    },

    borderRadiusAlert: '10px',
    borderRadiusBadge: '4px',
    borderRadiusButton: '6px',
    borderRadiusCalendarDayFocusRing: '4px',
    borderRadiusCodeEditor: '4px',
    borderRadiusContainer: '12px',
    borderRadiusControlCircularFocusRing: '4px',
    borderRadiusControlDefaultFocusRing: '4px',
    borderRadiusDropdown: '6px',
    borderRadiusDropzone: '4px',
    borderRadiusFlashbar: '6px',
    borderRadiusItem: '6px',
    borderRadiusInput: '6px',
    borderRadiusPopover: '6px',
    borderRadiusTabsFocusRing: '4px',
    borderRadiusTiles: '6px',
    borderRadiusToken: '4px',
    borderRadiusTutorialPanelItem: '6px',
  },
};

const buildDir = 'build';

buildThemedComponents({
  theme,
  outputDir: buildDir,
}).then(() => {
  // Fix artifacts to match @cloudscape-design/design-tokens

  fs.renameSync(
    path.join(buildDir, '/design-tokens/visual-refresh.scss'),
    path.join(buildDir, '/design-tokens/index.scss')
  );
});
