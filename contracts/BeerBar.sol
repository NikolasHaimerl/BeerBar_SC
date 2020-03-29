pragma solidity ^0.6.0;

import "./IBeerBar.sol";
import "./BeerToken.sol";
import "./ERC223/token/ERC223/IERC223Recipient.sol";
// Roles.sol implicitly imported via BeerToken, ERC223Mintable, MinterRole

contract BeerBar /* is IBeerBar */ {
    using Roles for Roles.Role;

    BeerToken private beerTokenContract;

    constructor () public {
       // Your code here...
    }

    // Your code here...

}
