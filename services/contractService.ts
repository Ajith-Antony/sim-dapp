import { Contract, BrowserProvider, parseUnits } from "ethers";
import contractJson from "@/hardhat/artifacts/contracts/MockAsset.sol/MockAsset.json";

const abi = contractJson.abi;
const LOCAL_HARDHAT_ADDRESS = process.env.NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS;
if (!LOCAL_HARDHAT_ADDRESS) {
  throw new Error(
    "NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS is not defined in .env.local"
  );
}

export const getContract = async (provider: BrowserProvider) => {
  const signer = await provider.getSigner();
  return new Contract(LOCAL_HARDHAT_ADDRESS, abi, signer);
};

export const fetchAssets = async (provider: BrowserProvider) => {
  const contract = await getContract(provider);
  const raw = await contract.getAssets();
  return raw;
};

export const buyAsset = async (provider: BrowserProvider, id: number) => {
  const contract = await getContract(provider);
  const tx = await contract.buy(id, {
    value: parseUnits("100", "wei"),
    gasLimit: 300000,
  });
  await tx.wait();
  return tx;
};
