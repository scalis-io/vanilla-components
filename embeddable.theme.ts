import { defineTheme } from '@embeddable.com/core';
import { Theme } from '@embeddable.com/vanilla-components';

const themeProvider = (clientContext: any, parentTheme: Theme): Theme => {
  /*
   * This allows for switching between the default and custom theme in the
   * builder based on presets/client-contexts.cc.yml. You can remove this
   * code if you don't want to do theme switching.
   */
  if (clientContext?.theme === 'default') {
    return parentTheme;
  }

  const { theme } = clientContext || {};
	return defineTheme(parentTheme, theme);
};

export default themeProvider;
