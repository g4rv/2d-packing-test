export class Rect {
	constructor(rect, idx) {
		this.width = rect.width;
		this.height = rect.height;
		this.x = 0;
		this.y = 0;
		this.initialOrder = idx;
	}

	rotate() {
		let temp = this.width;
		this.width = this.height;
		this.height = temp;
	}

    getArea() {
        return this.width * this.height
    }
}

export class Container {
	constructor(width, height, x, y) {
		this.mainArea = { x, y, width, height };
		this.subAreas = [];
	}
}

export class SubArea {
    constructor(width, height, x, y) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
	}

    getArea() {
        return this.width * this.height
    }
}