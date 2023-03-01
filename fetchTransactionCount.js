const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const apiUrl = "https://api.bscscan.com/api";
const startBlock = 0;
const endBlock = 99999999;
const page = 1;
const offset = 10;
const sort = "asc";
const apiKey = process.env.API_KEY;

// Read addresses from file and split into array
const addresses = fs.readFileSync("Addresses.txt", "utf-8").trim().split("\n");

// Loop through addresses and make API call for each with delay
addresses.forEach((address, index) => {
	const url = `${apiUrl}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&page=${page}&offset=${offset}&sort=${sort}&apikey=${apiKey}`;
	setTimeout(() => {
		axios
			.get(url)
			.then((response) => {
				console.log(`${address}: ${response.data.result.length} transactions`);
			})
			.catch((error) => {
				console.error(`Error for address ${address}: ${error}`);
			});
	}, index * 200);
});
