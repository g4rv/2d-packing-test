import { isOverlapping } from './utils/isOverlapping.js';
import { Rect, Container, SubArea } from './utils/classes.js';

const packRects = (canvas, rects) => {
	const { mainArea, subAreas } = new Container(
		canvas.width,
		canvas.height,
		0,
		0
	);
	const unpackedRects = rects
		.map((rect, i) => new Rect(rect, i))
		// Works better with sort
		.sort((a, b) => {
			const compareArea = b.height * b.width - a.height * a.width;
			const compareHeight = b.height - a.height;
			const compareWidth = b.width - a.width;

			return compareWidth;
		});
	const packedRects = [];

	for (let rectIdx = 0; rectIdx < unpackedRects.length; rectIdx++) {
		const currRect = unpackedRects[rectIdx];
		const { isFitNotRotated, isFitRotated } = checkIfFits(mainArea, currRect);

		if (isFitNotRotated || isFitRotated) {
			if (!isFitNotRotated && isFitRotated) currRect.rotate();
			packTheRect(mainArea, subAreas, currRect);
			packedRects.push(...unpackedRects.splice(rectIdx, 1));
			rectIdx = 0;
			continue;
		}

		for (let areaIdx = 0; areaIdx < subAreas.length; areaIdx++) {
			const currArea = subAreas[areaIdx];
			for (let rectIdx = 0; rectIdx < unpackedRects.length; rectIdx++) {
				const currRect = unpackedRects[rectIdx];
				const { isFitNotRotated, isFitRotated } = checkIfFits(
					currArea,
					currRect
				);

				// Didnt manage to make it work...
				// Creates to manny overlaps

				// if (!isFitNotRotated && !isFitRotated) {
				// 	const combinedArea = combinedAreas(packedRects, subAreas, currRect);
				// 	if (combinedArea) {
				// 		const isOverlappings = packedRects.some((rect) =>
				// 			isOverlapping(rect, combinedArea)
				// 		);
				// 		if (!isOverlappings) {
				// 			packTheRect(combinedArea, subAreas, currRect);
				// 			packedRects.push(...unpackedRects.splice(rectIdx, 1));
				// 			areaIdx = 0;
				// 			continue;
				// 		}
				// 	}
				// }

				if (isFitNotRotated || isFitRotated) {
					if (!isFitNotRotated && isFitRotated) currRect.rotate();
					packTheRect(currArea, subAreas, currRect);
					packedRects.push(...unpackedRects.splice(rectIdx, 1));
					rectIdx = 0;
				}
			}
		}
	}

	const closedEmptyAreas = subAreas.filter((area) => {
		return (
			packedRects.some((rect) => rect.x + rect.width === area.x) &&
			packedRects.some((rect) => rect.x === area.x + area.width) &&
			packedRects.some((rect) => rect.y + rect.height === area.y) &&
			packedRects.some((rect) => rect.y === area.y + area.height)
		);
	});

	const allEmptyAreasSum = closedEmptyAreas.reduce(
		(acc, cur) => acc + cur.getArea(),
		0
	);
	const allRectsArea = packedRects.reduce((acc, cur) => acc + cur.getArea(), 0);

	const fullness =
		closedEmptyAreas.length === 0
			? 1
			: allEmptyAreasSum / (allEmptyAreasSum - allRectsArea);

	return { fullness, blockCoordinates: packedRects, unpackedRects };
};

//HELPERS:
//Checks if newArea covers at some points previos areas
function isNewAreaCoversArea(prevArea, newArea) {
	const prevAreaLeft = prevArea.x;
	const prevAreaRight = prevArea.x + prevArea.width;
	const newAreaLeft = newArea.x;
	const newAreaRight = newArea.x + newArea.width;

	return {
		coversFull: prevAreaLeft > newAreaLeft && prevAreaRight < newAreaRight,
		coversLeftSide: prevAreaLeft < newAreaLeft && prevAreaRight > newAreaLeft,
		coversRightSide:
			prevAreaLeft < newAreaRight && prevAreaRight > newAreaRight,
	};
}

// Checks if curr Rect fits into area
function checkIfFits(container, rect) {
	const isFitNotRotated =
		rect.width <= container.width && rect.height <= container.height;
	const isFitRotated =
		rect.height <= container.width && rect.width <= container.height;

	return { isFitNotRotated, isFitRotated };
}

// Packs current Rect to some position
function packTheRect(container, subAreas, rect) {
	rect.x = container.x;
	rect.y = container.y;
	container.width = Math.max(container.width - rect.width, 0);
	container.x += rect.width;

	const newSubArea = createNewArea(container, subAreas, rect);
	updateSameXCordsAreas(subAreas, newSubArea, rect);
	subAreas = subAreas.filter((area) => area.width > 0 && area.height > 0);
	subAreas = subAreas.toSorted((aArea, bArea) => aArea.x - bArea.x);
}

function createNewArea(container, subAreas, rect) {
	const newArea = new SubArea(
		rect.width,
		container.height - rect.height,
		rect.x,
		rect.y + rect.height
	);

	subAreas.push(newArea);
	return newArea;
}

function updateSameXCordsAreas(subAreas, newSubArea, rect) {
	const sameCordsSubArea = subAreas.filter((area) => {
		const { coversLeftSide, coversRightSide, coversFull } = isNewAreaCoversArea(
			area,
			newSubArea
		);
		return coversLeftSide || coversRightSide || coversFull;
	});
	if (sameCordsSubArea.length <= 0) return;

	sameCordsSubArea.forEach((area) => {
		const { coversLeftSide, coversRightSide } = isNewAreaCoversArea(
			area,
			newSubArea
		);

		area.height -= rect.height + newSubArea.height;

		let newSubAreaSide;
		if (coversLeftSide) {
			newSubAreaSide = new SubArea(
				newSubArea.x - area.x,
				newSubArea.height + rect.height,
				newSubArea.x - (newSubArea.x - area.x),
				newSubArea.y - rect.height
			);
		} else if (coversRightSide) {
			newSubAreaSide = new SubArea(
				area.width - (newSubArea.x + newSubArea.width - area.x),
				newSubArea.height + rect.height,
				newSubArea.x + newSubArea.width,
				newSubArea.y - rect.height
			);
		}
		// area.color = `hsla(220deg, 100%, 70%, .4)`;
		area.initialOrder = rect.initialOrder;
		if (newSubAreaSide) {
			// newSubAreaSide.color = `hsla(120deg, 100%, 70%, .4)`;
			subAreas.push(newSubAreaSide);
		}
	});
}

// Used for combinig available areas for curr Rect to fit
// NOT WORKING PROPELY
function combinedAreas(rects, areas, currRect) {
	const sortedByX = areas.toSorted((a, b) => a.x - b.x);

	for (let leftAreaIdx = 0; leftAreaIdx < sortedByX.length - 1; leftAreaIdx++) {
		const leftArea = sortedByX[leftAreaIdx];
		if (leftArea.height < currRect.height) continue;

		let combinedWidth = leftArea.width;
		for (
			let rightAreaIdx = leftAreaIdx + 1;
			rightAreaIdx < sortedByX.length - leftAreaIdx;
			rightAreaIdx++
		) {
			const rightArea = sortedByX[rightAreaIdx];
			if (leftArea.y < rightArea.y && combinedWidth < currRect.width) break;

			combinedWidth += rightArea.width;
			if (combinedWidth >= currRect.width) {
				const combinedArea = new SubArea(
					currRect.width,
					currRect.height,
					leftArea.x,
					leftArea.y
				);
				if (rects.some((rect) => isOverlapping(rect, combinedArea))) break;

				return combinedArea;
			}
		}
	}
}

export default packRects;
