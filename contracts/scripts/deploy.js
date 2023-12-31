const hre = require("hardhat");

async function main() {
  const avatar = await hre.ethers.deployContract("Avatar");
  await avatar.waitForDeployment();

  console.log("Avatar contract: " + avatar.target);

  const certificate = await hre.ethers.deployContract("Certificate");
  await certificate.waitForDeployment();

  console.log("Certificate contract: " + certificate.target);

  const carbonMarket = await hre.ethers.deployContract("CarbonMarket", [
    avatar.target,
    certificate.target,
  ]);
  await carbonMarket.waitForDeployment();

  console.log("CarbonMarket contract: " + carbonMarket.target);

  const uniswapV2Factory = await hre.ethers.deployContract("UniswapV2Factory", [
    avatar.target,
  ]);
  await uniswapV2Factory.waitForDeployment();

  console.log("UniswapV2Factory contract: " + uniswapV2Factory.target);

  const simple_erc20 = await hre.ethers.deployContract("Avatar");
  await simple_erc20.waitForDeployment();

  console.log("ERC20 contract: " + simple_erc20.target);

  uniswapV2Factory.createPair(simple_erc20.target);

  const uniswapV2Router = await hre.ethers.deployContract("UniswapV2Router02", [
    uniswapV2Factory.target,
    "0x5300000000000000000000000000000000000004",
  ]);
  await uniswapV2Router.waitForDeployment();

  console.log("UniswapV2Router contract: " + uniswapV2Router.target);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
