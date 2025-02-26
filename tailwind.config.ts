import type { Config } from "tailwindcss"
type PluginAPI = {
	addUtilities: (utilities: Record<string, any>, options?: string[]) => void;
};
const plugin = require('tailwindcss/plugin');


const config = {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				background_secondary: 'hsl(var(--background_secondary))',
				foreground_secondary: 'hsl(var(--foreground_secondary))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'wiggle': {
					'0%, 100%': { transform: 'rotate(-15deg)' },
					'50%': { transform: 'rotate(3deg)' },
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)',
						filter: 'drop-shadow(-1px 20px 61px orange)'

					},
					'50%': {
						transform: 'translateY(-10px)',
						filter: 'drop-shadow(0px 0px 100px #ffedbd)'
					}
				},
				'float2': {
					'0%, 100%': {
						transform: 'translateY(0)',
						filter: 'drop-shadow(-1px 0px 30px cyan)'

					},
					'50%': {
						transform: 'translateY(-10px)',
						filter: 'drop-shadow(0px 0px 100px #9bf6ff)'
					}
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'wiggle': 'wiggle 5s ease-in-out infinite',
				'wiggle-float': 'wiggle 1s ease-in-out infinite, float 2s ease-in-out infinite',
				'wiggle-float-blue': 'wiggle 1s ease-in-out infinite, float2 2s ease-in-out infinite'
			}
		}

	},
	plugins: [
		require('tailwindcss-animate'),
		require('@tailwindcss/container-queries'),
		plugin(function ({ addUtilities }: PluginAPI) {
			const newUtilities = {
				'.scrollbar-gemini': {
					'&::-webkit-scrollbar': {
						width: '8px', // Adjust width as needed
						height: '8px', // Add height for horizontal scrollbar
					},
					'&::-webkit-scrollbar-track': {
						background: 'transparent' // Transparent background
					},   // Horizontal scrollbar (x-axis) specific styles
					'&::-webkit-scrollbar:horizontal': {
						height: '8px', // Smaller height for horizontal scrollbar
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#8a8a8a',
						border: '1px solid #8a8a8a',
						borderRadius: '1px' // Rounded corners
					}
				}
			};
			addUtilities(newUtilities, ['responsive', 'hover']);
		})
	]
} satisfies Config

export default config