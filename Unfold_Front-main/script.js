const web3 = new Web3(window.ethereum);
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "user",
				"type": "address"
			}
		],
		"name": "grantAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "receiveGift",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "user",
				"type": "address"
			}
		],
		"name": "revokeAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "withdrawAmount",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "balances",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "user",
				"type": "address"
			}
		],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Paste your ABI here
const contractAddress = '0xB2cFD5f926d151108500Aa7238A83B0C84ebebD0'; // Replace with your contract's address
const contract = new web3.eth.Contract(contractABI, contractAddress);


window.addEventListener('load', async () => {
    if (typeof window.ethereum !== 'undefined') {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        alert('Please install MetaMask!');
    }
});

async function sendGift() {
    const receiverAddress = document.getElementById('receiverAddress').value;
    const amount = web3.utils.toWei(document.getElementById('amount').value, 'ether');

    try {
        const accounts = await web3.eth.getAccounts();
        const senderAddress = accounts[0];
        await contract.methods.transfer(receiverAddress, amount).send({ from: senderAddress });
        alert('Red Envelope sent successfully!');
    } catch (error) {
        console.error('Error sending red envelope:', error);
        alert('Error sending red envelope. Please try again.', error);
    }
}
function handleRedeemClick() {
    console.log("Button clicked via inline handler");
    redeemGift();
}

document.getElementById('redEnvelopeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    sendGift();
});
/*
document.getElementById('receiveGiftForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = web3.utils.toWei(document.getElementById('amountToReceive').value, 'ether');

    try {
        const accounts = await web3.eth.getAccounts();
        const receiverAddress = accounts[0];
        await contract.methods.receiveGift().send({ from: receiverAddress, value: amount });
        alert('Gift received successfully!');
    } catch (error) {
        console.error('Error receiving gift:', error);
        alert('Error receiving gift. Please check the console for more details.');
    }
});
*/
async function redeemGift() {
    console.log("redeemGift function called");
    try {
        const accounts = await web3.eth.getAccounts();
        const claimerAddress = accounts[0];
        console.log("Claimer Address:", claimerAddress);
        
        await contract.methods.receiveGift().send({ from: claimerAddress });
        
        alert('Red Envelope redeemed successfully!');
    } catch (error) {
        console.error('Error redeeming red envelope:', error);
        alert('Error redeeming red envelope. Please try again.');
    }
}



const redeemButton = document.querySelector('#claimGiftForm button');
console.log(redeemButton);

document.getElementById('redeemButton').addEventListener('click', async (e) => {
    e.preventDefault();
    console.log("Redeem button clicked");
    redeemGift();
});




