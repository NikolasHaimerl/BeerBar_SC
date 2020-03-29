TU Wien's Virtual Beer Bar
==========================

Deadline: Mon, 27 April 2020, 24:00

For this assignment, we combine the most favorite hobby of students -
going out and drinking some beer - with the second favorite pastime -
coding.

After this exercise, you'll know how to deliver (or, in this case, mint)
beer and run your own bar. But don't worry, you don't have to get your
hands dirty - everything will run in the safe environment of a
decentralized app.

So let's get started with the smart contract!

Task 1: BeerToken (1 Point)
===========================

For starters, you'll make your very own token.  And - in contrast to
many ICOs - it even has an important utility: Your users will be able
to exchange this BeerToken for beer later on.

Your Token has to fulfill the following requirements:
- 1 beer token is equivalent to 1 glass of beer. It is not divisible.
- New beer tokens can be minted on demand by the owner of the token contract.
  (think of a beer delivery to the bar. The same amount of beer tokens have to be minted
  and sent to the bar by the owner of the bar).
- Beer tokens can be burned (as real beer is served to the customers
  and therefore "destroyed")
- In the past, many tokens got lost because they were sent to contracts
  that didn't support the receiving of tokens. Beer is valuable, so
  make sure this can't happen by accident.

Choose a token standard that fully supports these requirements, and use
it for your token. (Hint: take a look at the template in your git repository.)

Implementation:
---------------

* Implement your BeerToken contract in file `contracts/BeerToken.sol`.
* Your token should be standard-compliant (i.e. should include all 
  constant information describing the token contract).
* The file `test/BeerToken.js` implements test cases for this contract.
  You can run them using `truffle test test/BeerToken.js`, or automatically
  via commits to the Git repository on the server (by opening your project
  in Gitlab, and then clicking on CI/CD -> Jobs -> and then clicking on the
  status of the `test` stage).

> Remember: These tokens will be compatible with most wallets (because
> they comply with the ERC20 standard which is used by those wallets)
> If you want to, you can connect Metamask or MyEtherWallet to our blockchain,
> and use this interface to manage your tokens - and transfer them
> to other accounts.

Task 2: BeerBar (4 Points)
==========================

Now for the fun part: We get to spend those tokens!

An interface `IBeerBar` is already provided. This contract
allows bar owners to run their bar using their own beer token. It lays out
the basic functionality as follows:

Roles:
- For role modeling, we use the `Roles` based on the OpenZeppelin standard (you 
  can look at the `MinterRole` of tokens for inspiration).
- There is a `owner` role for administrative functions of this contract.
- Furthermore there is also a `barkeeper` role defined in this contract. 

> Remember: You can generate as many Ethereum accounts as you like.
> In the CLI, this is possible with `personal.newAccount("logic")`.
> When using logic as your password, they will be automatically
> unlocked with the `unlock()` command.

Organisational tasks:
- The OWNER has to set the beer price.
- The BARKEEPER open and close the bar.
- The OWNER can transfer part of the bar's ether to a specified address.

Beer tokens:
- The OWNER specifies which type of beer token the bar is going to accept.
- Beer tokens can be sent to the bar, i.e. the contract is a receiver of
  ERC223 tokens.
- The contract only accepts your specified beer token, and no other type of
token sent to it.
- When beer is delivered to the bar, an equal amount of beer tokens has to be
  sent to the bar marked "supply".
- CUSTOMERS can buy the bar's beer token for ether.

Beer orders:
- When a CUSTOMER sends an amount of tokens to the bar it means an order
  of the same amount of glasses of beer. This can be done during opening hours.
- During opening hours, BARKEEPERS check the order (to make sure the guest is
  not already too drunk, or underage - this process happens offline/offchain).
  When BARKEEPERS decide to accept the order, they serve (deliver) the beer to
  the CUSTOMER. If the order is declined, the barkeeper ignores it.
- CUSTOMERS can check their open/pending orders of beer.
- CUSTOMERS can cancel their orders before an order is accepted. This
  allows them to get their tokens back (e.g. if their order is declined or
  they no longer want to have the beer)

Implementation:
---------------

* Implement your BeerBar contract in file `contracts/BeerBar.sol`.
* After you've implemented all abstract functions of the `IBeerBar` contract,
  make your contract inherit from `IBeerBar`.
* The file `test/BeerBar.js` implements test cases for this contract.
  You can run them using `truffle test test/BeerBar.js`, or automatically
  via commits on the server.
* A web UI for the BeerBar is provided in the folder `public` for your convenience.
  You can use this UI for managing your bar. 
  Either run this UI via a local webserver, as specified in `public/README.md`, OR
  via our public webserver. You can open it via the URL <https://bar.pages.sc.logic.at/e01452766>.
  Making changes to the UI is not needed for this task.

Task 3: SongVotingBar
=====================

The days where dreadful music in bars gets played is now over -
customers can vote which songs get added to the playlist!

DJs:
- The bar needs DJs for playing music.
- DJs start the voting (during opening hours).
- DJs end the voting (before or at closing time).
- DJs play the next song according to the voting (songs get played offline/offchain).

Voting:
- While the voting period is open, customers push their favorite song in or up the
playlist by sending ether to the bar together with the title of their song.
- For this voting, customers receive beer tokens. The number of tokens is equivalent
to the amount of ether divided by the beer price. Any remainder is kept as tip.

Selection of the next song played:
- Feel free to define how this is done - you have to consider the votes, though.
- Furthermore, you have to decide, which parts of this
selection you like to implement in the web interface and which parts you provide in the contract.

3.1 Smart Contract (2.5 Points)
-----------------------------

Write your `SongVotingBar` in `contracts/SongVotingBar.sol`.

3.2 Test cases (1.5 Points)
-------------------------

Write test cases for your `SongVotingBar` in `test/SongVotingBar.js`.
Those test cases should cover all your added functionality.

3.3 Web UI (1 Point)
--------------------

A simple webinterface in Javascript using `web3.js` is provided that uses web3.js 
to communicate with the Bar contract.
Your job is to extend it, so it also works with your SongVotingBar.
You will notice that we deliberately did not specify the API for getting
the current vote list - feel free to implement that to your liking.

You will need to adjust the ABI in `public/js/abis.js`, and add further
HTML and Javascript (in `public/`) for your DJ role.

Task 4: Profit!
===============

You are now a proud bar owner, sit back, relax, and enjoy a nice cold BeerToken!

Please also write some short notes about your implementation of this exercise in 
`NOTES.md`. It should cover on which addresses you deployed the contracts, how 
you solved the exercise and which issues you faced.

Also, make us - the person at `addresses.getPublic(4)` - an OWNER of
the bar.

We promise, we won't mismanage it...

Make sure you have commited all your changes to our Git repository!

