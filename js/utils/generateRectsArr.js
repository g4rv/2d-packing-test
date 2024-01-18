const generateRectArr = (length, minSize, maxSize) => {
	const getRandomSize = (minSize = 2, maxSize = 15) => {
		return Math.round(Math.random() * (maxSize - minSize) + minSize) * 10;
	};
	return Array.from({ length }, () => {
		return {
			width: getRandomSize(minSize, maxSize),
			height: getRandomSize(minSize, maxSize),
		};
	});
};

export default generateRectArr;
