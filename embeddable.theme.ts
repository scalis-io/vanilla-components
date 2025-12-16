import { defineTheme } from '@embeddable.com/core';
import { Theme } from '@embeddable.com/vanilla-components';

const fontFamily = 'Inter';
const textNeutralPrimary = '#1F2124'
const iconNeutral20 = '#1F2124'

// ref: https://github.com/embeddable-hq/vanilla-components-v1/blob/main/src/themes/defaulttheme.ts
const themeProvider = (clientContext: any, parentTheme: Theme): Theme => {
  const scalisTheme = defineTheme(parentTheme, {
    brand: {
      primary: '#0021F8',
      secondary: '#B0D5FF',
    },
    charts: {
      colors: [
        '#cca9fd', // Lavender
        '#9faff9', // Light Blue
        '#77cdf8', // Sky Blue
        '#fe76bd', // Pink
        '#79f0ef', // Cyan
        '#61f48c', // Light Green
        '#bcf879', // Lime Green
        '#d0e967', // Yellow-Green
        '#f5ef54', // Yellow
        '#fcdb6c', // Light Orange
        '#fcc270', // Peach
        '#f9976c', // Orange-Pink
        '#fd746e', // Reddish-Pink
      ],
      fontWeights: {
        description: 400,
        kpiNumber: 500,
        pagination: 400,
        title: 500,
      },
    },
    container: {
      border: '1px solid #DDE5ED',
      padding: '16px',
    },
    controls: {
      backgrounds: {
        colors: {
          heavy: '#EEF3F8', // Chart square skeleton loading
          normal: '#0021F8', // blue
          soft: '#FFFFFF', // Input background | Table header background | Date picker background
          transparent: 'transparent',
        },
      },
      buttons: {
        active: {
          border: '#FFFFFF',
          fontColor: '#0021F8',
        },
        hovered: {
          background: '#D3E9FF',
          border: '#D3E9FF',
          fontColor: '#0021F8',
        },
        pressed: {
          background: '#B0D5FF',
          border: '#B0D5FF',
          fontColor: '#0021F8',
        },
        multiSelect: {
          active: {
            background: '#0021F8',
            border: '1px solid #0021F8',
            fontColor: '#FFFFFF',
          },
          inactive: {
            background: '#EEF3F8',
            border: '1px solid #ffffff',
            fontColor: textNeutralPrimary,
          },
        },
        radius: '12px',
      },
      borders: {
        colors: {
          normal: '#C3CFDC', // Input border
          heavy: '#1F2124', // Round border around date picker month chevrons
        }
      },
      datepicker: {
        backgrounds: {
          colors: {
            accent: '#FF0000',
            rangeEnd: '#0021F8',
            rangeEndDate: '#0021F8',
            rangeMiddle: '#E7F3FF',
            rangeStart: '#0021F8',
          }
        },
        radiuses: {
          button: '8px',
          buttonEnd: '0px 8px 8px 0px',
          buttonStart: '8px 0px 0px 8px',
          weekNumber: '8px',
        },
      },
      font: {
        colors: {
          normal: textNeutralPrimary,
        },
      },
      inputs: {
        colors: {
          hover: '#EEF3F8', // Date picker input
        },
      },
    },
    downloadMenu: {
      border: '1px solid #DDE5ED',
      borderRadius: '12px',
      font: {
        color: textNeutralPrimary,
        family: fontFamily,
        weight: 400,
      },
      hover: {
        backgroundColor: '#EEF3F8',
        fontColor: textNeutralPrimary,
        svgColor: iconNeutral20,
      },
    },
    font: {
      color: textNeutralPrimary,
      colorNormal: textNeutralPrimary, // Pagination text
      description: {
        color: '#606E7F',
        family: fontFamily,
      },
      family: fontFamily,
      title: {
        color: textNeutralPrimary,
        family: fontFamily,
      },
    },
    svg: {
      fillNormal: iconNeutral20, // Spinner | Dropdown ellipsis icon
      fillStrong: iconNeutral20, // Chevron icon
      strokeNormal: iconNeutral20, // Calendar icon | Download icon | Dropdown checkbox
    },
  })
  
  /*
   * This allows for switching between the default and custom theme in the
   * builder based on presets/client-contexts.cc.yml. You can remove this
   * code if you don't want to do theme switching.
   */
  if (clientContext?.theme === 'default') {
    return scalisTheme;
  } else if (clientContext?.theme === 'embeddable') {
    return parentTheme;
  } 

  const { theme } = clientContext || {};
  

  if (!theme || typeof theme !== 'object') {
    return scalisTheme;
  }
  
	return defineTheme(scalisTheme, theme);
};

export default themeProvider;
