// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NFTMinter {
    address public owner;
    uint256 public tokenCounter;
    mapping(address => uint256[]) public userNFTs;
    mapping(uint256 => address) public tokenOwners;
    mapping(uint256 => string) public tokenURIs;

    constructor() {
        owner = msg.sender;
        tokenCounter = 0;
    }

    function mintNft(address _to, string memory _tokenURI) external returns (uint256) {
        require(msg.sender == owner, "Only owner can mint NFTs");
        uint256 tokenId = tokenCounter;
        tokenOwners[tokenId] = _to;
        tokenURIs[tokenId] = _tokenURI;
        userNFTs[_to].push(tokenId);
        tokenCounter++;
        return tokenId;
    }

    function fetchAllNfts() external view returns (uint256[] memory) {
        uint256[] memory tokens = new uint256[](tokenCounter);
        for (uint256 i = 0; i < tokenCounter; i++) {
            tokens[i] = i;
        }
        return tokens;
    }

    function fetchUserNfts(address _user) external view returns (uint256[] memory) {
        return userNFTs[_user];
    }

    function getTokenURI(uint256 _tokenId) external view returns (string memory) {
        require(_tokenId < tokenCounter, "Invalid token ID");
        return tokenURIs[_tokenId];
    }
}
