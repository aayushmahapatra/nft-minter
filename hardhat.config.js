/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {},
    mumbai: {
      url: process.env.REACT_APP_MUMBAI_RPC,
      accounts: [process.env.REACT_APP_METAMASK_PRIVATE_KEY],
    },
  },
  solidity: "0.8.0",
};

// npx hardhat run scripts/deploy.js --network <network-name>
