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

const getBalanceAndTransactions = async (address) => {
	const balanceUrl = `https://api.bscscan.com/api?module=account&action=balance&address=${address}&apikey=${apiKey}`;
	const oneMonthAgo = Math.floor(
		(Date.now() - 30 * 24 * 60 * 60 * 1000) / 1000
	);
	const transactionsUrl = `https://api.bscscan.com/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=${apiKey}&timestamp=${oneMonthAgo}`;
	try {
		const [balanceResponse, transactionsResponse] = await Promise.all([
			axios.get(balanceUrl),
			axios.get(transactionsUrl),
		]);
		const balance = balanceResponse.data.result;
		const formattedBalance = Number(balance) / 10 ** 18;
		const formattedAddress = address.toLowerCase();
		const transactionCount = transactionsResponse.data.result.length;
		if (formattedBalance >= 2 && transactionCount > 0) {
			const output = `${formattedAddress}\t${formattedBalance.toFixed(
				18
			)}\t${transactionCount}\n`;
			fs.appendFileSync("final.txt", output);
			console.log(`Address ${address} has balance ${balance}`);
		} else {
			console.log(`Address ${address} has balance ${balance}, skipping`);
		}
	} catch (error) {
		console.error(
			`Error fetching balance and transactions for address ${address}:`,
			error.message
		);
	}
};

const addresses = readAddressFile("Addresses.txt");

fs.writeFileSync(
	"final.txt",
	"Address\t\t\t\t\t\t\t\t\t\tBalance(BNB)\t\tTx Count\n"
);

let index = 0;
const interval = setInterval(() => {
	if (index >= addresses.length) {
		clearInterval(interval);
		return;
	}
	const address = addresses[index];
	getBalanceAndTransactions(address);
	index++;
}, 500);
