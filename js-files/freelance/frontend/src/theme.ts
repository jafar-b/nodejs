import { extendTheme, } from '@chakra-ui/react';

interface ColorHues {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface CustomColors {
  brand: ColorHues;
  secondary: ColorHues;
}

const colors: CustomColors = {
  brand: {
    50: '#e6f5ff',
    100: '#b3e0ff',
    200: '#80ccff',
    300: '#4db8ff',
    400: '#1aa3ff',
    500: '#0094f7',
    600: '#0078cc',
    700: '#005c9e',
    800: '#004070',
    900: '#002442',
  },
  secondary: {
    50: '#f0f8ff',
    100: '#e6f2ff',
    200: '#bfd9ff',
    300: '#99c0ff',
    400: '#66a3ff',
    500: '#3385ff',
    600: '#0066ff',
    700: '#0052cc',
    800: '#003d99',
    900: '#002966',
  },
};

const fonts = {
  heading: "'Poppins', sans-serif",
  body: "'Inter', sans-serif",
};

const theme = extendTheme({
  colors,
  fonts,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'md',
      },
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        secondary: {
          bg: 'secondary.500',
          color: 'white',
          _hover: {
            bg: 'secondary.600',
          },
        },
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
          _hover: {
            bg: 'brand.50',
          },
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
  },
});

export default theme; 