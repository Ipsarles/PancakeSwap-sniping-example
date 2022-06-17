const ethers = require('ethers');
const prompt = require('prompt-sync')({ sigint: true });
const Secret = require('./Secret');
//Secret is simply a file containing the public key and secret key of your wallet.


// CHOSES A CHANGER
const privateKey = Secret["private_key"]// 
const myAddress = Secret["public_key"] // 

amountToSwap = 1 // En BNB
const gwei = '5'
const slippage = 0
// FIN CHOSES A CHANGER

abii = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
]





const addresses = {
    //WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",   // Must have BNB
    WBNB: "0xe9e7cea3dedca5984780bafc599bd69add087d56", // If BUSD on the pair
    //WBNB:"0x55d398326f99059ff775485246999027b3197955", // If USDT
    router: "0x10ed43c718714eb63d5aa57b78b54704e256024e", // Router pancakeswap
    target: myAddress
}
if (addresses.WBNB === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
    amountToSwap = amountToSwap.toString();
} else {
    amountToSwap = amountToSwap * 10 ** 18;
    amountToSwap = amountToSwap.toString();
}
//WBNB= "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";   // Must have BNB
WBNB = "0xe9e7cea3dedca5984780bafc599bd69add087d56"; // If BUSD on the pair
//WBNB="0x55d398326f99059ff775485246999027b3197955"; // If USDT
const BNBAmount = ethers.utils.parseEther(amountToSwap).toHexString();
const gasPrice = ethers.utils.parseUnits(gwei, 'gwei');
const gas = {
    gasPrice: gasPrice,
    gasLimit: 1000000
}
//yes

const BSCprovider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const account = new ethers.Wallet(privateKey, BSCprovider);

const router = new ethers.Contract(
    addresses.router,
    [
        'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'
    ],
    account
);

const router2 = new ethers.Contract(
    addresses.router,
    [
        'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'

    ],
    account
);



const snipe = async (token) => {
    if (addresses.WBNB === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
        const tx = await router.swapExactETHForTokens(
            slippage,
            [addresses.WBNB, token],
            addresses.target,
            Math.floor(Date.now() / 1000) + 60 * 20,
            {
                ...gas,
                value: BNBAmount
            }
        );
        console.log(`Swapping BNB for tokens...`);
        const receipt = await tx.wait();
        console.log(`Transaction hash: ${receipt.transactionHash}`);
    } else {
        const tx = await router2.swapExactTokensForTokens(
            amountToSwap,
            slippage,
            [addresses.WBNB, token],
            addresses.target,
            Math.floor(Date.now() / 1000) + 60 * 20,
            {
                ...gas
            }
        );
        console.log(`Swapping Stable for tokens...`);
        const receipt = await tx.wait();
        console.log(`Transaction hash: ${receipt.transactionHash}`);
    }
}



const token = prompt('Input token address:');

(async () => {
    await snipe(token);
})();