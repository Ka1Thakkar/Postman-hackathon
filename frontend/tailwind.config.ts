import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			hivegreen: '#038175',
			hivewhite: '#F0EFDD',
			hiveoffwhite: '#D9D7BF',

  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		fontFamily:{
			poppins: ['var(--font-poppins)'],
			polyamine: ['var(--font-polyamine)']
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
