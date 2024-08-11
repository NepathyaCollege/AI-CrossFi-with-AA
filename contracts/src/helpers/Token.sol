// SPDX-License-Identifier: BUSL-1.1
pragma solidity ^0.8.20;

import {ERC20Permit, ERC20} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20Permit, Ownable {
    uint8 internal immutable tokenDecimals;

    constructor(string memory tokenName, string memory tokenSymbol, uint8 _tokenDecimals)
        Ownable(msg.sender)
        ERC20(tokenName, tokenSymbol)
        ERC20Permit(tokenName)
    {
        tokenDecimals = _tokenDecimals;
    }

    /// @notice Mint new LP tokens and transfer them to an account.
    /// @param _to The account to send the newly minted tokens to
    /// @param _amount How many tokens to mint
    function mint(address _to, uint256 _amount) external {
        _mint(_to, _amount);
    }

    /// @notice Burn tokens currently owned by an account.
    /// @param _from The account to burn the tokens from
    /// @param _amount How many tokens to burn
    function burnFrom(address _from, uint256 _amount) external {
        _burn(_from, _amount);
    }

    /// @notice How many decimals are used by this token.
    /// @return The amount of decimals
    function decimals() public view override returns (uint8) {
        return tokenDecimals;
    }
}
