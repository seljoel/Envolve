// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract EnvolveNFT is ERC721URIStorage, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;
    using Strings for uint256;

    // --- State ---
    uint256 private _currentTokenId = 0;
    uint256 public genesisTokenId;
    bool public genesisMinted = false;

    mapping(address => bool) public hasOnboarded;
    EnumerableSet.AddressSet private onboarders;

    struct NFTData {
        EnumerableSet.AddressSet owners;
        uint256 actionCount;
        uint8 stage; // 0: Genesis, 1: Evolved, 2: Final
        uint256 parentTokenId;
    }

    mapping(uint256 => NFTData) private _nftData;
    mapping(address => uint256) public userToTokenId;

    // --- Events ---
    event Onboarded(address user, uint256 tokenId);
    event ActionCompleted(address user, uint256 tokenId, uint256 totalActions);
    event NFTUpgraded(address triggerer, uint256 fromTokenId, uint256 toTokenId, uint8 newStage);

    constructor() ERC721("Envolve", "ENV") Ownable(msg.sender) {}

    // --- Onboarding ---
    function onboard() external {
        require(!hasOnboarded[msg.sender], "Already onboarded");
        
        onboarders.add(msg.sender);
        hasOnboarded[msg.sender] = true;

        if (!genesisMinted) {
            genesisTokenId = _mintWithAutoId(address(this), "ipfs://stage0.json");
            genesisMinted = true;
            _nftData[genesisTokenId].stage = 0;
        }

        _nftData[genesisTokenId].owners.add(msg.sender);
        userToTokenId[msg.sender] = genesisTokenId;

        emit Onboarded(msg.sender, genesisTokenId);
    }

    // --- Action Tracking ---
    function completeAction() external {
        uint256 tokenId = userToTokenId[msg.sender];
        require(tokenId != 0, "Not onboarded");

        NFTData storage data = _nftData[tokenId];
        data.actionCount++;

        emit ActionCompleted(msg.sender, tokenId, data.actionCount);

        if (data.actionCount == 10 && data.stage == 0) {
            _upgradeToStage1(msg.sender, tokenId);
        } 
        else if (data.actionCount == 25 && data.stage == 1) {
            _upgradeToStage2(msg.sender, tokenId);
        }
    }

    // --- Evolution Logic ---
    function _upgradeToStage1(address user, uint256 oldTokenId) private {
        uint256 newTokenId = _mintWithAutoId(address(this), "ipfs://stage1.json");
        
        // Migrate only this user
        _nftData[newTokenId].owners.add(user);
        _nftData[newTokenId].stage = 1;
        _nftData[newTokenId].parentTokenId = oldTokenId;
        userToTokenId[user] = newTokenId;

        // Remove from old NFT (others remain)
        _nftData[oldTokenId].owners.remove(user);

        emit NFTUpgraded(user, oldTokenId, newTokenId, 1);
    }

    function _upgradeToStage2(address user, uint256 oldTokenId) private {
        uint256 newTokenId = _mintWithAutoId(
            user, 
            string(abi.encodePacked("ipfs://stage2_", userToTokenId[user], ".json"))
        );
        
        // Unique NFT for this user
        _nftData[newTokenId].stage = 2;
        _nftData[newTokenId].owners.add(user);
        _nftData[newTokenId].parentTokenId = oldTokenId;
        userToTokenId[user] = newTokenId;

        // Remove from old NFT
        _nftData[oldTokenId].owners.remove(user);

        emit NFTUpgraded(user, oldTokenId, newTokenId, 2);
    }

    // --- Shared Ownership Management ---
    function joinEvolvedNFT(uint256 tokenId) external {
        require(_nftData[tokenId].stage == 1, "Not an Evolved NFT");
        require(_nftData[tokenId].owners.contains(msg.sender) == false, "Already member");
        
        // Verify user has completed 10 actions on their current NFT
        uint256 currentTokenId = userToTokenId[msg.sender];
        require(_nftData[currentTokenId].actionCount >= 10, "Complete 10 actions first");

        _nftData[tokenId].owners.add(msg.sender);
        userToTokenId[msg.sender] = tokenId;
    }

    // --- Helpers ---
    function _mintWithAutoId(address to, string memory uri) private returns (uint256) {
        _currentTokenId++;
        _mint(to, _currentTokenId);
        _setTokenURI(_currentTokenId, uri);
        return _currentTokenId;
    }
}