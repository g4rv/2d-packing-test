const fetchRects = async (url = '../db.json') => {
	try {
		const res = await fetch(url);
		if (res.status !== 200)
			throw new Error('Something went wrong! Blocks are not retreaved!');
		return await res.json();
	} catch (err) {
		console.error(err);
	}
};

export default fetchRects;
