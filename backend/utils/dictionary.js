require("dotenv").config();
const api = process.env.DICTIONARY_API_KEY;
const dictionaryData = async (word) => {
	try {
		const url = `https://www.dictionaryapi.com/api/v3/references/sd2/json/${word}?key=${api}`;
		const response = await fetch(url);
		const data = await response.json();

		const items = data.slice(0, 3).map((item) => {
			const word = item.hwi?.hw || "N/A";
			const definition = item.shortdef?.[0] || "No definition";
			const pronounce = item.hwi?.prs?.[0]?.sound?.audio || "No audio";
			const fl = item?.fl || "No ___"; //change later
			return { word, definition, pronounce, fl };
		});
		return items;
	} catch (e) {
		return e;
	}
};

console.log(dictionaryData());

module.exports = dictionaryData;
