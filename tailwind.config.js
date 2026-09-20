/** @type {import('tailwindcss').Config} */
import colors from './src/utils/colors';

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontSize: {
      "display-large": "56px",
      "display-medium": "45px",
      "display-small": "36px",
      "headline-large": "32px",
      "headline-medium": "28px",
      "headline-small": "24px",
      "title-large": "22px",
      "title-medium": "16px",
      "title-small": "14px",
      "body-large": "16px",
      "body-medium": "14px",
      "body-small": "12px",
      "label-large": "14px",
      "label-medium": "12px",
      "label-small": "11px",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
    colors,
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
