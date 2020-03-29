const truffleAssert = require('truffle-assertions');

const BeerToken = artifacts.require("BeerToken");
const BeerBar = artifacts.require("BeerBar");

const web3 = BeerToken.web3;

const assertEventNot = function(transactionHash, eventSignatureString) {
    assert.equal(
        containsEvent(transactionHash, eventSignatureString), 
        false, 
        "Expected NOT to contain event + eventSignatureString"
    );
}

const assertEvent = async function(transactionHash, eventSignatureString) {
    assert.equal(
        await containsEvent(transactionHash, eventSignatureString), 
        true, 
        "Expected to contain event + eventSignatureString"
    );
}

// the truffle tx object does not contain events that are emitted by another
// contract during a transaction (i.e. not the one that was called directly)
// solution: get web3 transaction receipt and look for event signature
const containsEvent = async function(transactionHash, eventSignatureString) {
    /*
    Since we cannot use the truffle tx return object, we have to filter
    the web3 transaction object obtained via getTransactionReceipt.

    Events are stored in the tx.logs array, where the topic[0] contains
    the keccak hash of the event signature.

    https://codeburst.io/deep-dive-into-ethereum-logs-a8d2047c7371
    */

    let tx = await web3.eth.getTransactionReceipt(transactionHash);
    let eventHash = web3.utils.sha3(eventSignatureString);

    let eventFound = false;
    for (var i = 0; i < tx.logs.length; i++) {
        var topic = tx.logs[i].topics[0];
        if(topic === eventHash) {
            eventFound = true;
            break;
        }
    }
    return eventFound;
}


contract("BeerBar test", async accounts => {
  let beerToken;
  let beerBar;

  let owner = accounts[0];
  let barkeeper = accounts[1];
  let partygoer = accounts[2]; // 50 BeerTokens

  async function deployAndInit() {
    // deployed behaves like a singleton. It will look if there is already an instance of the contract deployed to the blockchain via deployer.deploy. The information about which contract has which address on which network is stored in the build folder. new will always create a new instance. [https://ethereum.stackexchange.com/questions/42094/should-i-use-new-or-deployed-in-truffle-unit-tests]
    beerToken = await BeerToken.new();
    await beerToken.mint(partygoer, 50);

    beerBar = await BeerBar.new();
    await beerBar.setBeerTokenContractAddress(beerToken.address);
  }

  beforeEach("deploy and init", async () => {
    await deployAndInit();
  });

  it("BeerToken should be set", async () => {
    assert.equal(await beerBar.beerTokenContractAddress.call(), beerToken.address);
  });

  it("barkeeper cannot set BeerToken", async () => {
    await beerBar.addBarkeeper(barkeeper);
    await truffleAssert.reverts(beerBar.setBeerTokenContractAddress(barkeeper, {from: barkeeper}));
    assert.equal(await beerBar.beerTokenContractAddress.call(), beerToken.address);
  });

  it("owner should be set", async () => {
    assert(await beerBar.isOwner(owner));
  });

  it("barkeeper should be set", async () => {
    let result = await beerBar.addBarkeeper(barkeeper);

    truffleAssert.eventEmitted(result, 'BarkeeperAdded', (ev) => {
      return ev['account'] === barkeeper;
    }, 'BarkeeperAdded should be emitted with correct parameters');

    assert(await beerBar.isBarkeeper(barkeeper));
  });

  it("bar closed when not opened before", async () => {
    assert.equal(await beerBar.barIsOpen.call(), false);
  });

  it("owner cannot open bar", async () => {
    let result = await truffleAssert.reverts(beerBar.openBar({from: owner}));
    assert.equal(await beerBar.barIsOpen.call(), false);
  });

  it("barkeeper can open bar", async () => {
    await beerBar.addBarkeeper(barkeeper);

    let result = await beerBar.openBar({from: barkeeper});
    truffleAssert.eventEmitted(result, 'BarOpened');
    assert.equal(await beerBar.barIsOpen.call(), true);
  });

  it("buy beer fails when bar is closed", async () => {
    await truffleAssert.reverts(beerToken.transfer(beerBar.address, 10, {from: partygoer}));
    assert.equal(await beerToken.balanceOf.call(partygoer), 50);
  });


  it("buy beer succeed when bar is open", async () => {
    await beerBar.addBarkeeper(barkeeper);
    await beerBar.openBar({from: barkeeper});

    let tx = await beerToken.transfer(beerBar.address, 10, {from: partygoer});
    truffleAssert.eventEmitted(tx, 'Transfer');
    await assertEvent(tx.receipt.transactionHash, 'BeerOrdered(address,uint256)');
    assert.equal(await beerToken.balanceOf.call(partygoer), 40);
  });

  it("bar does not accept transfer from foreign token", async () => {
    let otherBeerToken = await BeerToken.new();
    await otherBeerToken.mint(partygoer, 50);
    assert.notEqual(beerToken.address, otherBeerToken.address);

    await beerBar.addBarkeeper(barkeeper);
    await beerBar.openBar({from: barkeeper});

    await truffleAssert.reverts(otherBeerToken.transfer(beerBar.address, 10, {from: partygoer}));
    assert.equal(await otherBeerToken.balanceOf.call(beerBar.address), 0);
  });

  it("barkeeper can serve beer", async () => {
    await beerBar.addBarkeeper(barkeeper);
    await beerBar.openBar({from: barkeeper});
    await beerToken.transfer(beerBar.address, 10, {from: partygoer});

    await beerBar.serveBeer(partygoer, 5, {from: barkeeper});
    assert.equal(await beerBar.pendingBeer(partygoer), 5);
  });

  it("barkeeper can serve beer only when bar is open", async () => {
    await beerBar.addBarkeeper(barkeeper);
    await beerBar.openBar({from: barkeeper});
    await beerToken.transfer(beerBar.address, 10, {from: partygoer});

    await beerBar.closeBar({from: barkeeper});
    await truffleAssert.reverts(beerBar.serveBeer(partygoer, 5, {from: barkeeper}));
    assert.equal(await beerBar.pendingBeer(partygoer), 10);
  });

  it("owner can supply beer", async () => {
    await beerToken.mint(owner, 100);
    let amount1 = (await beerToken.balanceOf.call(beerBar.address)).toNumber();
    await beerToken.methods['transfer(address,uint256,bytes)'](beerBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    let amount2 = (await beerToken.balanceOf.call(beerBar.address)).toNumber();
    assert.equal(amount2 - amount1, 100);
  });

  it("barkeepers cannot supply beer", async () => {
    await beerToken.mint(barkeeper, 100);
    let amount1 = (await beerToken.balanceOf.call(beerBar.address)).toNumber();
    await truffleAssert.reverts(beerToken.methods['transfer(address,uint256,bytes)'](beerBar.address, 100, web3.utils.fromAscii("supply"), {from: barkeeper}));
    let amount2 = (await beerToken.balanceOf.call(beerBar.address)).toNumber();
    assert.equal(amount2 - amount1, 0);
  });

  it("owner can set the beerPrice", async () => {
    await beerBar.setBeerPrice(10);
    let beerPrice = (await beerBar.getBeerPrice.call()).toNumber();
    assert.equal(beerPrice, 10);
  });

  it("barkeeper cannot set the beerPrice", async () => {
    await beerBar.addBarkeeper(barkeeper);
    await beerBar.setBeerPrice(10);

    let beerPriceBefore = (await beerBar.getBeerPrice.call()).toNumber();
    await truffleAssert.reverts(beerBar.setBeerPrice(100, {from: barkeeper}));
    let beerPriceAfter = (await beerBar.getBeerPrice.call()).toNumber();
    assert.equal(beerPriceAfter,  beerPriceBefore);
  });

  it("owner can set the beerPrice only when bar is closed", async () => {
    await beerBar.setBeerPrice(10);
    await beerBar.addBarkeeper(barkeeper);
    await beerBar.openBar({from: barkeeper});

    let beerPriceBefore = (await beerBar.getBeerPrice.call()).toNumber();
    await truffleAssert.reverts(beerBar.setBeerPrice(100, {from: owner}));
    let beerPriceAfter = (await beerBar.getBeerPrice.call()).toNumber();
    assert.equal(beerPriceBefore, beerPriceAfter);
  });

  it("others can buy BeerTokens", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](beerBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await beerBar.setBeerPrice(10);

    let amountBefore = (await beerToken.balanceOf.call(partygoer)).toNumber();
    await beerBar.buyToken({value: 100, from: partygoer});
    let amountAfterwards = (await beerToken.balanceOf.call(partygoer)).toNumber();
    assert.equal(amountAfterwards - amountBefore, 10);
  });

  it("owner can payout", async () => {
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](beerBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await beerBar.setBeerPrice(10);
    await beerBar.buyToken({value: 100, from: partygoer});

    let balanceBefore = await web3.eth.getBalance(beerBar.address);
    assert.equal(balanceBefore, 100);

    await beerBar.payout(owner, balanceBefore, {from: owner})

    let balanceAfterwards = await web3.eth.getBalance(beerBar.address);
    assert.equal(balanceAfterwards, 0);
  });

  it("barkeeper cannot payout", async () => {
    await beerBar.addBarkeeper(barkeeper);
    await beerToken.mint(owner, 100);
    await beerToken.methods['transfer(address,uint256,bytes)'](beerBar.address, 100, web3.utils.fromAscii("supply"), {from: owner});
    await beerBar.setBeerPrice(10);
    await beerBar.buyToken({value: 100, from: partygoer});

    let balanceBefore = await web3.eth.getBalance(beerBar.address);

    await truffleAssert.reverts(beerBar.payout(owner, balanceBefore, {from: barkeeper}));

    let balanceAfterwards = await web3.eth.getBalance(beerBar.address);
    assert.equal(balanceAfterwards, balanceBefore);
  });

});

