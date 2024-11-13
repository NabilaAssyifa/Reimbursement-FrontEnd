const flowbite = require('flowbite/plugin');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  theme: {
    extend: {
      keyframes: {
        count: {
          '0%': { opacity: '0', transform: 'translateY(20%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        count: 'count 1s ease-in-out',
      },
    },
  },
  plugins: [
    flowbite,
  ],
};
