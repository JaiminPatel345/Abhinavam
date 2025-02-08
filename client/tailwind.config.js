/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Custom Fonts
      fontFamily: {
        pthin: ['Poppins-Thin', 'sans-serif'],
        pextralight: ['Poppins-ExtraLight', 'sans-serif'],
        plight: ['Poppins-Light', 'sans-serif'],
        pregular: ['Poppins-Regular', 'sans-serif'],
        pmedium: ['Poppins-Medium', 'sans-serif'],
        psemibold: ['Poppins-SemiBold', 'sans-serif'],
        pbold: ['Poppins-Bold', 'sans-serif'],
        pextrabold: ['Poppins-ExtraBold', 'sans-serif'],
        pblack: ['Poppins-Black', 'sans-serif'],
      },
      // Color Palette
      colors: {
        // Base Colors
        primary: {
          DEFAULT: '#4C585B', // Dark Slate Gray (Primary)
          light: '#7E99A3', // Light Slate Gray
          dark: '#2C3639', // Darker Slate Gray
        },
        secondary: {
          DEFAULT: '#A5BFCC', // Light Blue Gray (Secondary)
          light: '#D1E0E6', // Lighter Blue Gray
          dark: '#7E99A3', // Darker Blue Gray
        },
        accent: {
          DEFAULT: '#F4EDD3', // Beige (Accent)
          light: '#FFF8E7', // Lighter Beige
          dark: '#E0D4B8', // Darker Beige
        },
        // Text Colors
        text: {
          DEFAULT: '#2C3639', // Dark Slate Gray (Normal Text)
          light: '#F4EDD3', // Beige (Text in Dark Mode)
          muted: '#7E99A3', // Light Slate Gray (Muted Text)
          error: '#FF6B6B', // Red (Error Text)
          success: '#4C585B', // Dark Slate Gray (Success Text)
        },
        // Background Colors
        background: {
          DEFAULT: '#F4EDD3', // Beige (Light Mode Background)
          dark: '#2C3639', // Dark Slate Gray (Dark Mode Background)
        },
        // Navigation Bar
        navbar: {
          DEFAULT: '#4C585B', // Dark Slate Gray
          text: '#F4EDD3', // Beige (Navbar Text)
        },
        // Buttons
        button: {
          primary: '#4C585B', // Dark Slate Gray (Primary Button)
          secondary: '#A5BFCC', // Light Blue Gray (Secondary Button)
          submit: '#4C585B', // Dark Slate Gray (Submit Button)
          delete: '#FF6B6B', // Red (Delete Button)
          edit: '#A5BFCC', // Light Blue Gray (Edit Button)
        },
        // Alerts
        alert: {
          success: '#4C585B', // Dark Slate Gray (Success Alert)
          error: '#FF6B6B', // Red (Error Alert)
          warning: '#F4EDD3', // Beige (Warning Alert)
          info: '#7E99A3', // Light Slate Gray (Info Alert)
        },
        // Logo
        logo: {
          DEFAULT: '#4C585B', // Dark Slate Gray
          light: '#F4EDD3', // Beige (Light Mode Logo)
        },
        // Post Headings
        postHeading: {
          DEFAULT: '#2C3639', // Dark Slate Gray
          light: '#F4EDD3', // Beige (Light Mode Post Heading)
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
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },

  },
  plugins: [],
};