import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: ({ ownerState, theme }) => ({
          ...{
            padding: theme.spacing(2),
            borderWidth: '1.5px',
          },
        }),
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'md',
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#F05941',
    },
  },
});

export default theme;
