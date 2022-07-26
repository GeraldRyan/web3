// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract GRERC721 is ERC721URIStorage {
    address erc20;
    uint256 public maxSupply;
    uint256 public totalminted;

    mapping(address => uint256) private totalAssetsOwned;

    /// @dev Constructor to initialize state variables
    constructor(uint256 _maxSupply) ERC721("Gerald Ryan", "GCR") {
        maxSupply = _maxSupply;
        totalminted = 0;
    }

    function totalSupply() public view returns (uint256) {
        return maxSupply;
    }

    /// @dev Allows anyone to mint NFT
    function mintNFT(string memory metadata) public {
        require(totalminted <= maxSupply - 1, "No NFT left to mint");
        _mint(msg.sender, totalminted);
        _setTokenURI(totalminted, metadata);
        totalAssetsOwned[msg.sender]++;
        totalminted++;
    }

    /// @dev Allows owner of NFT to transfer it to other adds
    function transferNFT(address to, uint256 assetId) public {
        require(_exists(assetId), "asset not available");
        require(ownerOf(assetId) != to, "Asset already owned by adds");
        totalAssetsOwned[to]++;
        _transfer(msg.sender, to, assetId);
        emit Transfer(msg.sender, to, assetId);
    }
}
