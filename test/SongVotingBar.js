const truffleAssert = require('truffle-assertions');

const BeerToken = artifacts.require("BeerToken");
const SongVotingBar = artifacts.require("SongVotingBar");

contract("SongVotingBar test", async accounts => {
  let songVotingBar;

  beforeEach("deploy and init", async () => {
    songVotingBar = await SongVotingBar.new();
  });

  // Your test cases for the SongVotingBar
  // ...


});
