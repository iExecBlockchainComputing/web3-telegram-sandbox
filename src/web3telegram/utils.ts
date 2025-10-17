export type Address = `0x${string}`;

export type AddressOrEnsName = Address | string;

export const IEXEC_EXPLORER_URL = "https://explorer.iex.ec/bellecour/dataset/";

export const WEB3TELEGRAM_APP_ENS = "web3telegram.apps.iexec.eth";

const IEXEC_CHAIN_ID = "0x86"; // 134

export const SUPPORTED_CHAINS = [
  {
    id: 134,
    name: "Bellecour",
    blockExplorerUrl: "https://blockscout-bellecour.iex.ec",
    tokenSymbol: "xRLC",
    rpcUrls: ["https://bellecour.iex.ec"],
  },
  {
    id: 42161,
    name: "Arbitrum",
    blockExplorerUrl: "https://arbiscan.io/",
    tokenSymbol: "RLC",
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
  },
  {
    id: 421614,
    name: "Arbitrum Sepolia",
    blockExplorerUrl: "https://sepolia.arbiscan.io/",
    tokenSymbol: "RLC",
    rpcUrls: ["https://sepolia-rollup.arbitrum.io/rpc"],
  },
];

export function checkIsConnected() {
  if (!window.ethereum) {
    console.log("Please install MetaMask");
    throw new Error("No Ethereum provider found");
  }
}

export async function checkCurrentChain(selectedChainId?: number) {
  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
    params: [],
  });

  const targetChainId = selectedChainId
    ? `0x${selectedChainId.toString(16)}`
    : IEXEC_CHAIN_ID;

  if (currentChainId !== targetChainId) {
    const chain = SUPPORTED_CHAINS.find((c) => c.id === selectedChainId);
    if (!chain) {
      throw new Error(`Chain with ID ${selectedChainId} not supported`);
    }

    console.log(`Please switch to ${chain.name} chain`);
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: targetChainId,
            chainName: chain.name,
            nativeCurrency: {
              name: chain.tokenSymbol,
              symbol: chain.tokenSymbol,
              decimals: 18,
            },
            rpcUrls: chain.rpcUrls || ["https://bellecour.iex.ec"],
            blockExplorerUrls: [chain.blockExplorerUrl],
          },
        ],
      });
      console.log(`Switched to ${chain.name} chain`);
    } catch (err) {
      console.error(`Failed to switch to ${chain.name} chain:`, err);
      throw err;
    }
  }
}
