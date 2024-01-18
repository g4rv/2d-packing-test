import { ctx } from "./getDOM.js";

const renderRects = (rects, colorPalete) => {
	rects.forEach((rect, i) => {
		ctx.beginPath();
		ctx.fillStyle = colorPalete.get(rect.width * rect.height);
		ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
		ctx.font = '14px Arial white';
		ctx.fillStyle = 'white';
		ctx.textAlign = 'center';
        ctx.str
		ctx.fillText(
			rect.initialOrder,
			rect.x + rect.width / 2,
			rect.y + rect.height / 2 + 5
            );
	});
}

export default renderRects