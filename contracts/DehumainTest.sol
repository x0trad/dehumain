// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
/// @notice Test rehearsal only. No dollar oracle, token balance gate or agent activation.
contract DehumainTest is ERC721URIStorage {
    uint256 public constant MAX_SUPPLY = 3;
    uint256 public constant PAID_PRICE = 0.0001 ether;
    address public immutable treasury;
    uint256 public minted;
    mapping(address => bool) public isTester;
    mapping(address => uint256) public mintCount;
    string[3] private metadata;
    constructor(address treasury_, address[2] memory testers_, string[3] memory uris) ERC721('Dehumain Test V2', 'DHTEST') {
        require(block.chainid == 46630 || block.chainid == 1337, 'Test network only');
        require(treasury_ != address(0), 'Invalid treasury');
        require(testers_[0] != address(0) && testers_[1] != address(0), 'Invalid tester');
        require(testers_[0] != testers_[1], 'Duplicate tester');
        treasury = treasury_;
        isTester[testers_[0]] = true;
        isTester[testers_[1]] = true;
        metadata = uris;
    }
    function mint() external payable {
        require(isTester[msg.sender], 'Test wallet only');
        require(minted < MAX_SUPPLY, 'Sold out');
        require(msg.value == (mintCount[msg.sender] == 0 ? 0 : PAID_PRICE), 'Incorrect payment');
        uint256 id = ++minted;
        mintCount[msg.sender]++;
        _safeMint(msg.sender, id);
        _setTokenURI(id, metadata[id - 1]);
    }
    // Return simulated payments only to the fixed test treasury.
    function reclaimTestETH() external {
        require(msg.sender == treasury, 'Treasury only');
        (bool ok,) = payable(treasury).call{value:address(this).balance}('');
        require(ok, 'Transfer failed');
    }
}
