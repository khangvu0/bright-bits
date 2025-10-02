// backend/utils/random.js
const fs = require("fs").promises;
const path = require("path");

async function randomWord() {
	const filePath = path.join(__dirname, "./word.json"); //The pathway to the file
	const data = await fs.readFile(filePath, "utf8"); //utf8 tells read file to return a string
	const wordParsedData = JSON.parse(data); //converts the data(string) into a object

	const wordList = wordParsedData.words; //calls the object with the words key

	//random number based on the length on the length of word list
	const randomIndex = Math.floor(Math.random() * wordList.length);
	return wordList[randomIndex]; //grabs from the array of wordlist
}

module.exports = randomWord;
