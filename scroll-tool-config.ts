export const ScrollToolConfig = {
	scrollDistance: 4000,
	breakpoint: 1560,
	frameCount: 111,
	canvas: {
		width: 1920,
		height: 1280,
	},
	blocks: [
		{
			id: 'first-headline',
			text: 'Neaky text',
			visibleFromTo: [100, 800],
			styles: {
				color: 'red',
				position: 'absolute',
				top: '10%',
				left: '50%',
				fontSize: 80,
			},
		},
	],
} as const;
