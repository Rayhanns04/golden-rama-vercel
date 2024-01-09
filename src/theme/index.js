import { inputAnatomy } from "@chakra-ui/anatomy";
import {
  extendTheme,
  theme as base,
  createMultiStyleConfigHelpers,
  defineStyleConfig,
  defineStyle,
  useColorModeValue,
} from "@chakra-ui/react";
import { StepsStyleConfig as Steps } from "chakra-ui-steps";
import { Global } from "@emotion/react";

const inputHelpers = createMultiStyleConfigHelpers(inputAnatomy.keys);

export const Fonts = () => (
  <Global
    styles={`
      @font-face {
        font-family: 'Uniform';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/uniform/Uniform.ttf');
      }
      @font-face {
        font-family: 'Uniform';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/uniform/Uniform Bold.ttf');
      }
      @font-face {
        font-family: 'Helvetica';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url('/fonts/helvetica/Helvetica.ttf');
      }
      @font-face {
        font-family: 'Helvetica';
        font-style: normal;
        font-weight: 700;
        font-display: swap;
        src: url('/fonts/helvetica/Helvetica-Bold.ttf');
      }
      `}
  />
);

const colors = {
  brand: {
    blue: {
      600: "#213C45",
      500: "#345F6E",
      400: "#41778A",
      300: "#6792A1",
      200: "#A0BBC5",
      100: "#F0F4F5",
    },
    orange: {
      600: "#5E370B",
      500: "#A56014",
      400: "#EB891C",
      300: "#F1AC60",
      200: "#F7D0A4",
      100: "#FDF3EC",
    },
  },
  gradient: {
    linear: {
      orange: "linear-gradient(99.76deg, #EF8305 -1.17%, #FFC700 100%)",
      green: "linear-gradient(256.85deg, #3FB546 0%, #167A1C 100%)",
      blue: "linear-gradient(99.76deg, #345F6E -1.17%, #3BBFED 100%)",
      red: "linear-gradient(99.76deg, #E21D2A 30.7%, #FF7780 100%)",
    },
  },
  alert: {
    failed: "#CC0000",
  },
  neutral: {
    900: "#1A202C",
    text: {
      low: "#9E9E9E",
      medium: "#666666",
      high: "#212121",
    },
    color: {
      bg: {
        primary: "#F2F2F2",
        secondary: "#F7F7F7",
      },
      line: {
        secondary: "#E0E0E0",
      },
    },
    black: {
      700: "#5E5E5E",
    },
  },
};
const fonts = {
  heading: `"Uniform", ${base.fonts?.heading}`,
  body: `"Helvetica", ${base.fonts?.body}`,
};

const inputStyle = inputHelpers.definePartsStyle({
  // define the part you're going to style
  field: {
    fontSize: "sm",
    bg: "neutral.color.bg.secondary",
    _focusVisible: {
      borderColor: "brand.blue.400",
    },
  },
});
const Input = inputHelpers.defineMultiStyleConfig({
  variants: { filled: inputStyle },
  baseStyle: inputStyle,
});

const Button = defineStyleConfig({
  variants: {
    dropdown: { bg: "neutral.color.bg.secondary" },
  },
  // baseStyle: customGrayBg,
});

const Textarea = defineStyleConfig({
  variants: {
    filled: {
      bg: "neutral.color.bg.secondary",
      _focusVisible: {
        borderColor: "brand.blue.400",
      },
    },
  },
  baseStyle: {
    bg: "neutral.color.bg.secondary",
  },
});

const Heading = {
  baseStyle: {
    fontSize: "xl",
  },
};

const Divider = {
  baseStyle: {
    borderColor: "neutral.color.line.secondary",
  },
};

const Skeleton = {
  baseStyle: {
    size: "3rem",
    startColor: "#F1F1F1",
  },
};

const defaultTheme = {
  styles: {
    global: {
      "html, body": {
        minHeight: "100vh",
        textColor: "#616161",
        lineHeight: "tall",
      },
      "h1,h2,h3,h4,h5,h6": {
        color: "neutral.text.high",
        fontStyle: "normal",
      },
      a: {
        color: "brand.blue.400",
      },
    },
  },
};

export const theme = extendTheme({
  ...defaultTheme,
  components: {
    Button,
    Input,
    Heading,
    Steps,
    Skeleton,
    Divider,
    Textarea,
  },
  colors,
  fonts,
  initialColorMode: "light",
  useSystemColorMode: false,
});
