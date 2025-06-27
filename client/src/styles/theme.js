export const theme = {
  colors: {
    primary: '#4361ee',
    primaryLight: '#4cc9f0',
    secondary: '#3f37c9',
    success: '#4bb543',
    danger: '#ff3333',
    warning: '#f9c74f',
    info: '#4cc9f0',
    light: '#f8f9fa',
    dark: '#212529',
    gray: '#6c757d',
    grayLight: '#e9ecef',
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    pill: '50rem',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  transition: 'all 0.2s ease-in-out',
};

export const darkTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    light: '#1a1a1a',
    dark: '#f8f9fa',
    gray: '#adb5bd',
    grayLight: '#343a40',
  },
};
