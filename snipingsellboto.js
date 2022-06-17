const ethers = require('ethers');
const prompt = require('prompt-sync')({ sigint: true });
const { Contract } = require('ethers');
const secret = require('./secret')
// Installer ethers et prompt (npm install)
// Executer node snipe.js


const BSCprovider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

const privateKey = secret["private_key"]
const myAddress = secret["public_key"]

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

const gwei = '5'
const slippage = 0


const gasPrice = ethers.utils.parseUnits(gwei, 'gwei');
const gas = {
    gasPrice: gasPrice,
    gasLimit: 1000000
}


const options = {
    address: myAddress,
    provider: BSCprovider,
}

const getBalance = async (options, tokenAddress) => {
    const contract = new Contract(tokenAddress, abii, options.provider);
    const balance = await contract.balanceOf(options.address);
    b = balance._hex
    return b;
};


const addresses = {
    //WBNB: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",   // Must have BNB
    WBNB: "0xe9e7cea3dedca5984780bafc599bd69add087d56", // If BUSD on the pair
    //WBNB:"0x55d398326f99059ff775485246999027b3197955", // If USDT
    router: "0x10ed43c718714eb63d5aa57b78b54704e256024e", // Router pancakeswap
    target: myAddress
}

const account = new ethers.Wallet(privateKey, BSCprovider);
const router = new ethers.Contract(
    addresses.router,
    [
        'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
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
    BNBAmount = await getBalance(options, token);
    console.log(BNBAmount);
    if (addresses.WBNB === "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c") {
        const tx = await router.swapExactTokensForETH(
            BNBAmount,
            slippage,
            [token, addresses.WBNB],
            addresses.target,
            Math.floor(Date.now() / 1000) + 60 * 20,
            {
                ...gas,
            });
        console.log(`Swapping BNB for tokens...`);
        const receipt = await tx.wait();
        console.log(`Transaction hash: ${receipt.transactionHash}`);
    } else {
        console.log("noooo");
        console.log(BNBAmount);
        const tx = await router2.swapExactTokensForTokens(
            BNBAmount,
            slippage, // Degen ape don't give a fuxk about slippage
            [token, addresses.WBNB],
            addresses.target,
            Math.floor(Date.now() / 1000) + 60 * 20, // 10 minutes from now
            {
                ...gas
            }
        );
        console.log(`Swapping BNB for tokens...`);
        const receipt = await tx.wait();
        console.log(`Transaction hash: ${receipt.transactionHash}`);
    }


}


const token = prompt('What do you want to sell ? ');

(async () => {
    await snipe(token);
})();