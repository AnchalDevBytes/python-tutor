import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			'gray-800': '#1F2937',
			'gray-900': '#111827',
			'purple-600': '#9333EA',
  		},
  	}
  },
  plugins: [],
} satisfies Config;
