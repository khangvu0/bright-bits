require("dotenv").config();
const DICTIONARY_API_KEY = process.env.DICTIONARY_API_KEY;

function buildAudioUrl(pronunciation) {
	if (!pronunciation || pronunciation === "No audio") return null;

	let subdir;
	if (pronunciation.startsWith("bix")) {
		subdir = "bix";
	} else if (pronunciation.startsWith("gg")) {
		subdir = "gg";
	} else if (/^[0-9]/.test(pronunciation)) {
		subdir = "number";
	} else {
		subdir = pronunciation[0];
	}

	return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdir}/${pronunciation}.mp3`;
}
const getWordDetails = async (word) => {
	try {
		const url = `https://www.dictionaryapi.com/api/v3/references/sd2/json/${word}?key=${DICTIONARY_API_KEY}`;
		const response = await fetch(url);
		const data = await response.json();

		const maxWordDetailObjects = 3;
		const items = data.slice(0, maxWordDetailObjects).map((item) => {
			const word = item.meta?.id.split(":")[0] || "N/A";
			const definition = item.shortdef?.[0] || "No definition";
			const audioId = item.hwi?.prs?.[0]?.sound?.audio || null;
			const pronunciation = audioId ? buildAudioUrl(audioId) : null;
			const functionalLabel = item?.fl || "Unknown";
			return { word, definition, audioId, pronunciation, functionalLabel };
		});
		return items;
	} catch (e) {
		return "error pulling data";
	}
};
module.exports = getWordDetails;

//work on name conventions
