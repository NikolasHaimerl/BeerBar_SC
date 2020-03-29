const truffleAssert = require('truffle-assertions');

const BeerToken = artifacts.require("BeerToken");

contract("BeerToken test", async accounts => {
  it("should be indivisible", async () => {
    let instance = await BeerToken.deployed();
    let decimals = await (instance.decimals.call()).valueOf();
    assert.equal(decimals, 0);
  });

  it("should be mintable", async () => {
    let instance = await BeerToken.deployed();
    let amount1 = (await instance.totalSupply.call()).toNumber();
    let result = await instance.mint(accounts[0], 100);
    truffleAssert.eventEmitted(result, 'Transfer');
    let amount2 = (await instance.totalSupply.call()).toNumber();
    assert.equal(amount2 - amount1, 100);

    
  });

  it("should not be mintable by someone else", async () => {
    let instance = await BeerToken.deployed();
    await truffleAssert.reverts(instance.mint(accounts[0], 100, {'from': accounts[1]}));
  });

  it("should be burnable", async () => {
    let instance = await BeerToken.deployed();
    await instance.mint(accounts[1], 10);
    let amount1 = (await instance.balanceOf.call(accounts[1])).toNumber();
    await instance.burn(10, {'from': accounts[1]});
    let amount2 = (await instance.balanceOf.call(accounts[1])).toNumber();
    assert.equal(amount1 - amount2, 10);
  });
});

