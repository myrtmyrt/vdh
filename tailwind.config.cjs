/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				myGreen: "#606C38",
				primary: "#D95D39",
				secondary: "#283618"
			}
		},
	},
	plugins: [],
}
