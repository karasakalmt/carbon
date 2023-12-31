// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./certificate.sol";
import "./avatar.sol";

/// @title A NFT Marketplace using ERC1155
/// @author Karan J Goraniya
/// @notice You can use this contract to list NFT on Marketplace
/// @dev All function calls are currently implemented without side effects

contract CarbonMarket is ERC1155Holder {
    uint256[] public nftList;

    Certificate public certificate;
    Avatar public token;
    mapping(uint256 => address) public retireList;

    event Fractionize(address fractionizer, uint256 nftId);
    event Retire(address retirer, uint256 nftId);

    constructor(address _certificateCont, address _AvatarToken) {
        certificate = Certificate(_certificateCont);
        token = Avatar(_AvatarToken);
    }

    function getNftList() public view returns (uint256[] memory) {
        return nftList;
    }

    function removeItem(uint256 nftId) internal {
        for (uint i = 0; i < nftList.length; i++) {
            if (nftList[i] == nftId) {
                delete nftList[i];
            }
        }
    }

    function fractionizeNft(uint256 nftId) external {
        require(nftId >= 0, "Token doesnot exist");
        certificate.safeTransferFrom(msg.sender, address(this), nftId, 1, "");
        token.mint(msg.sender, certificate.tokenToValue(nftId));
        nftList.push(nftId);
        emit Fractionize(msg.sender, nftId);
    }

    function retireNft(uint256 nftId) external payable {
        uint256 value = certificate.tokenToValue(nftId);
        require(
            token.balanceOf(msg.sender) >= value,
            "you don't have enough tokens"
        );
        token.burnFrom(msg.sender, value);
        certificate.retireCertificate(nftId);
        retireList[nftId] = msg.sender;
        removeItem(nftId);
        emit Retire(msg.sender, nftId);
    }
}
