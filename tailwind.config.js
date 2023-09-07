import config from './appconfig.json'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
 
    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mainColor': config.backgroundColor,
        'cardColor': config.cardColor,
        'mainFontColor': config.fontColor,
        'secondaryFontColor': config.additionalFontColor,
      }
    },
  },
  plugins: [],
}

