// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title EnvolveNFT
 * @dev A dynamic NFT that evolves based on real-world actions.
 */
contract EnvolveNFT is ERC721, ERC721URIStorage, Ownable {
    // --- State Variables ---
    uint256 private _currentTokenId = 0;  // Replaces Counter
    
    address public actionVerifierAddress;
    
    // Evolution thresholds
    uint256 public constant ACTIONS_FOR_EVOLUTION = 10;
    uint256 public constant ACTIONS_FOR_SPLIT = 25;

    // Metadata URIs
    string private _baseMetadataURI_Stage0; // Initial state
    string private _baseMetadataURI_Stage1; // Evolving state
    string private _baseMetadataURI_Split;  // Post-split base URI

    // NFT Data Structure
    struct NFTData {
        uint256 actionCount;
        address[4] owners;
        uint8 evolutionStage; // 0: Genesis, 1: Evolving, 2: Split
    }
    
    mapping(uint256 => NFTData) public nftData;

    // Events
    event NFTStateChange(uint256 indexed tokenId, uint8 newStage, string newURI);

    constructor(
        string memory initialStage0URI,
        string memory initialStage1URI,
        string memory initialSplitURI
    ) ERC721("Envolve", "ENV") Ownable(msg.sender) {
        _baseMetadataURI_Stage0 = initialStage0URI;
        _baseMetadataURI_Stage1 = initialStage1URI;
        _baseMetadataURI_Split = initialSplitURI;
    }

    // --- Token Management ---
    function _mintWithAutoId(address to) private returns (uint256) {
        _currentTokenId++;
        _safeMint(to, _currentTokenId);
        return _currentTokenId;
    }

    function mintGenesis(address[4] memory initialOwners) external {
        uint256 newTokenId = _mintWithAutoId(address(this));
        _setTokenURI(newTokenId, _baseMetadataURI_Stage0);

        nftData[newTokenId] = NFTData({
            actionCount: 0,
            owners: initialOwners,
            evolutionStage: 0
        });

        emit NFTStateChange(newTokenId, 0, _baseMetadataURI_Stage0);
    }

    // --- Core Logic ---
    function incrementActionCount(uint256 tokenId) external {
        require(msg.sender == actionVerifierAddress, "Envolve: Caller is not the verifier");
        
        NFTData storage data = nftData[tokenId];
        require(data.evolutionStage < 2, "Envolve: NFT has already been split");

        data.actionCount++;

        if (data.actionCount == ACTIONS_FOR_EVOLUTION) {
            data.evolutionStage = 1;
            _setTokenURI(tokenId, _baseMetadataURI_Stage1);
            emit NFTStateChange(tokenId, 1, _baseMetadataURI_Stage1);
        }

        if (data.actionCount >= ACTIONS_FOR_SPLIT) {
            _splitNFT(tokenId);
        }
    }

    function _splitNFT(uint256 originalTokenId) internal {
        NFTData storage data = nftData[originalTokenId];
        require(data.actionCount >= ACTIONS_FOR_SPLIT, "Envolve: Not enough actions to split");

        data.evolutionStage = 2;

        // Mint 4 new NFTs
        for (uint8 i = 0; i < 4; i++) {
            uint256 newTokenId = _mintWithAutoId(data.owners[i]);
            string memory newUri = string(abi.encodePacked(
                _baseMetadataURI_Split, 
                "/", 
                Strings.toString(i + 1), 
                ".json"
            ));
            _setTokenURI(newTokenId, newUri);
        }

        _burn(originalTokenId);
    }

    // --- Admin Functions ---
    function setActionVerifierAddress(address _verifierAddress) external onlyOwner {
        actionVerifierAddress = _verifierAddress;
    }

    function setBaseURIs(
        string memory stage0, 
        string memory stage1, 
        string memory split
    ) external onlyOwner {
        _baseMetadataURI_Stage0 = stage0;
        _baseMetadataURI_Stage1 = stage1;
        _baseMetadataURI_Split = split;
    }

    // --- Overrides ---
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}