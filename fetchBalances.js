const fs = require("fs");
const axios = require("axios");
require("dotenv").config();

const apiKey = process.env.API_KEY;

const readAddressFile = (fileName) => {
	const fileContent = fs.readFileSync(fileName, "utf-8");
	const addresses = fileContent
		.split("\n")
		.filter((line) => line.trim() !== "");
	return addresses;
};

const getBalance = async (address) => {
	const url = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
	try {
		const response = await axios.get(url);
		const balance = response.data.result;
		const formattedBalance = Number(balance) / 10 ** 18;
		const formattedAddress = address.toLowerCase();
		if (formattedBalance >= 2) {
			const output = `${formattedAddress}\t${formattedBalance.toFixed(18)}\n`;
			fs.appendFileSync("final.txt", output);
			console.log(`Address ${address} has balance ${balance}`);
		} else {
			console.log(`Address ${address} has balance ${balance}, skipping`);
		}
	} catch (error) {
		console.error(
			`Error fetching balance for address ${address}:`,
			error.message
		);
	}
};

const addresses = readAddressFile("Addresses.txt");

fs.writeFileSync("final.txt", "Address\t\t\t\t\t\t\t\t\t\tBalance(BNB)\n");

let index = 0;
const interval = setInterval(() => {
	if (index >= addresses.length) {
		clearInterval(interval);
		return;
	}
	const address = addresses[index];
	getBalance(address);
	index++;
}, 1000);
