import { ethers } from "ethers";
import NFTMinter from "../Nft-Minter.json";
import { CONTRACT_ADDRESS } from "../config";

export async function connectWallet() {
  await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(CONTRACT_ADDRESS, NFTMinter.abi, signer);

  return { signer, contract };
}

export async function connectMetaMask() {
  const { signer } = await connectWallet();
  const address = await signer.getAddress();
  const balance = await signer.getBalance();
  const formattedBalance = ethers.utils.formatEther(balance);
  return { address, formattedBalance };
}
