export const isOverlapping = (rect1, rect2) => {
	const overlapScenario1 =
		((rect1.x <= rect2.x && rect1.x + rect1.width > rect2.x) ||
			(rect1.x < rect2.x + rect2.width &&
				rect1.x + rect1.width >= rect2.x + rect2.width)) &&
		((rect1.y >= rect2.y && rect1.y + rect1.height > rect2.y) ||
			(rect1.y < rect2.y + rect2.height &&
				rect1.y + rect1.height >= rect2.y + rect2.height));
	const overlapScenario2 =
		rect1.x <= rect2.x &&
		rect1.x + rect1.width <= rect2.x + rect2.width &&
		rect1.y >= rect2.y &&
		rect1.y + rect1.height <= rect2.y + rect2.height;


	return overlapScenario1 || overlapScenario2;
};

export const isOverlappingX = (rect1, rect2) =>
	(rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width) ||
	(rect1.x + rect1.width > rect2.x && rect1.x < rect2.x) ||
	(rect1.x + rect1.width <= rect2.x && rect1.x >= rect2.x);
