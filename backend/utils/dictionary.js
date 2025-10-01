require("dotenv").config();
const DICTIONARY_API_KEY = process.env.DICTIONARY_API_KEY;
const getWordDetails = async (word) => {
	try {
		const url = `https://www.dictionaryapi.com/api/v3/references/sd2/json/${word}?key=${DICTIONARY_API_KEY}`;
		const response = await fetch(url);
		const data = await response.json();

		const maxWordDetailObjects = 3;
		const items = data.slice(0, maxWordDetailObjects).map((item) => {
			const word = item.meta?.id.split(":")[0] || "N/A";
			const definition = item.shortdef?.[0] || "No definition";
			const pronunciation = item.hwi?.prs?.[0]?.sound?.audio || "No audio";
			const functionalLabel = item?.fl || "No ___"; //change later
			return { word, definition, pronunciation, functionalLabel };
		});
		return items;
	} catch (e) {
		return "error pulling data";
	}
};

module.exports = getWordDetails;

//work on name conventions
