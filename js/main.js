import packRects from './functionalApproach.js';
import fetchRects from './utils/fetchRects.js';
import generateRandomColorPalette from './utils/generateRandomColorPalette.js';
import generateRectArr from './utils/generateRectsArr.js';
import {
	canvas,
	fullnessHeading,
	packedRectsHeading,
	unpackedRectsHeading,
} from './utils/getDOM.js';
import renderRects from './utils/renderRects.js';

canvas.width = Math.min(window.innerWidth - 100, 1400);
canvas.height = window.innerHeight - 300;

const RECTS_ARR_LENGTH = 25;
const generatedRects = generateRectArr(RECTS_ARR_LENGTH, 2, 15);
const fetchedRects = await fetchRects();
const rects = fetchedRects || generatedRects;

const randomColorsPalete = generateRandomColorPalette(rects);
const container = { width: canvas.width, height: canvas.height };

let result = packRects(container, rects);
renderRects(result.blockCoordinates, randomColorsPalete);
window.addEventListener('resize', () => {
	canvas.width = window.innerWidth - 100;
	result = packRects(canvas, rects);
	renderRects(result.blockCoordinates, randomColorsPalete);

	unpackedRectsHeading.innerText = `UNPACKED RECTS: ${result.unpackedRects.length}`;
	packedRectsHeading.innerText = `PACKED RECTS: ${result.blockCoordinates.length}`;
	fullnessHeading.innerText = `FULLNESS: ${result.fullness}`;
});

unpackedRectsHeading.innerText = `UNPACKED RECTS: ${result.unpackedRects.length}`;
packedRectsHeading.innerText = `PACKED RECTS: ${result.blockCoordinates.length}`;
fullnessHeading.innerText = `FULLNESS: ${result.fullness}`;
