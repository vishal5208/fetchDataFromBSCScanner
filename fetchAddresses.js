const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://api.bscscan.com/api";

async function fetchBlockMiners(startBlockNumber, endBlockNumber) {
	const filePath = "Addresses.txt";
	const stream = fs.createWriteStream(filePath);

	for (let i = startBlockNumber; i <= endBlockNumber; i++) {
		const url = `${BASE_URL}?module=block&action=getblockreward&blockno=${i}&apikey=${API_KEY}`;
		try {
			const response = await axios.get(url);
			const blockMiner = response.data.result.blockMiner;
			console.log(blockMiner);
			const line = `${blockMiner}\n`;
			stream.write(line);
		} catch (error) {
			console.log(`Error fetching block ${i}: ${error}`);
		}
	}

	stream.end();
}

fetchBlockMiners(0, 500); // Replace 'latest' with the latest block number
