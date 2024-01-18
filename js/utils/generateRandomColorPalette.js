const generateRandomColorPalette = (rects) => {
    const palete = new Map()

    rects.forEach((rect, i) => {
        const rectArea = rect.width * rect.height
        const color = `hsl(${rectArea / i}deg, 50%, 50%)`
        palete.set(rectArea, color)
    })

    return palete
}

export default generateRandomColorPalette