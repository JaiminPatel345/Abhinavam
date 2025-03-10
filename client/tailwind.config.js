/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Custom Fonts
      fontFamily: {
        // Core Instagram-like fonts
        thin: ['Poppins-Thin', 'sans-serif'],
        extralight: ['Poppins-ExtraLight', 'sans-serif'],
        light: ['Poppins-Light', 'sans-serif'],
        regular: ['Poppins-Regular', 'sans-serif'],
        medium: ['Poppins-Medium', 'sans-serif'],
        semibold: ['Poppins-SemiBold', 'sans-serif'],
        bold: ['Poppins-Bold', 'sans-serif'],
        extrabold: ['Poppins-ExtraBold', 'sans-serif'],
        black: ['Poppins-Black', 'sans-serif'],
      },
      // Color Palette - Instagram-inspired with your brand's touch
      colors: {
        // Base Colors
        primary: {
          DEFAULT: '#0095F6', //  blue
          light: '#47B5FF',
          dark: '#0077C8',
        },
        secondary: {
          DEFAULT: '#262626', // Dark gray
          light: '#8E8E8E',
          dark: '#121212',
        },
        accent: {
          DEFAULT: '#E1306C', // Instagram gradient pink
          light: '#F56040', // Instagram gradient orange
          dark: '#C13584', // Darker pink
        },
        // Text Colors
        text: {
          DEFAULT: '#262626', // Instagram text dark
          light: '#F5F5F5', // Light text
          muted: '#8E8E8E', // Instagram secondary text
          error: '#ED4956', // Instagram error red
          success: '#78DE45', // Success green
        },
        // Background Colors
        background: {
          DEFAULT: '#F4EDD3', // Instagram white background
          dark: '#121212', // Dark mode background
          light: '#F4EDD3', // Instagram light gray background
          secondary: '#EFEFEF', // Secondary background
        },
        // Navigation Bar
        navbar: {
          DEFAULT: '#FFFFFF', // Instagram navbar
          dark: '#121212', // Dark mode navbar
          text: '#262626', // Navbar text
        },
        // Buttons
        button: {
          primary: '#0095F6', // Instagram blue
          secondary: '#EFEFEF',
          submit: '#0095F6',
          delete: '#ED4956',
          edit: '#8E8E8E',
        },
        // Alerts
        alert: {
          success: '#78DE45',
          error: '#ED4956',
          warning: '#FFDD00',
          info: '#0095F6',
        },
        // Logo
        logo: {
          DEFAULT: '#262626',
          light: '#FFFFFF',
        },
        // Post Headings
        postHeading: {
          DEFAULT: '#262626',
          light: '#F5F5F5',
        },
        // Instagram UI specific colors
        instagram: {
          blue: '#0095F6',
          gradient1: '#E1306C',
          gradient2: '#F56040',
          gradient3: '#FCAF45',
          like: '#ED4956',
          separator: '#DBDBDB',
          verified: '#0095F6',
        },
      },

      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      borderRadius: {
        'xs': '0.125rem',
        'sm': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        'full': '9999px', // Instagram's rounded buttons/avatars
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};