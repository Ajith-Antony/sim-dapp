// scripts/deploy.js
const fs = require("fs");
const path = require("path");
const hre = require("hardhat");

async function main() {
  const MockAsset = await hre.ethers.getContractFactory("MockAsset");
  const mock = await MockAsset.deploy();
  await mock.waitForDeployment(); // Ethers v6

  const address = await mock.getAddress();
  console.log("Deployed MockAsset at", address);

  const envPath = path.resolve(__dirname, "../../.env.local");

  let envContent = "";
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
  }

  const filtered = envContent
    .split("\n")
    .filter((line) => !line.startsWith("NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS"))
    .join("\n");

  const newEnv =
    filtered + `\nNEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS=${address}\n`;

  fs.writeFileSync(envPath, newEnv, "utf-8");
  console.log(
    `Updated .env.local with NEXT_PUBLIC_HARDHAT_CONTRACT_ADDRESS=${address}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
