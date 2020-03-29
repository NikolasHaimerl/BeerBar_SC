const BeerToken = artifacts.require("BeerToken");
const BeerBar = artifacts.require("BeerBar");

module.exports = function(deployer) {
  deployer.deploy(BeerToken);
  deployer.deploy(BeerBar);
};
