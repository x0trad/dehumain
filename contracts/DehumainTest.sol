// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
/// @notice Test rehearsal only. No dollar oracle, token balance gate or agent activation.
contract DehumainTest is ERC721URIStorage {
    uint256 public constant MAX_SUPPLY = 3;
    uint256 public constant PAID_PRICE = 0.0001 ether;
    address public immutable tester;
    uint256 public minted;
    mapping(address => uint256) public mintCount;
    string[3] private metadata;
    constructor(address tester_, string[3] memory uris) ERC721('Dehumain Test', 'DHTEST') {
        require(block.chainid == 46630 || block.chainid == 1337, 'Test network only');
        require(tester_ != address(0), 'Invalid tester');
        tester = tester_;
        metadata = uris;
    }
    function mint() external payable {
        require(msg.sender == tester, 'Test wallet only');
        require(minted < MAX_SUPPLY, 'Sold out');
        require(msg.value == (mintCount[msg.sender] == 0 ? 0 : PAID_PRICE), 'Incorrect payment');
        uint256 id = ++minted;
        mintCount[msg.sender]++;
        _safeMint(msg.sender, id);
        _setTokenURI(id, metadata[id - 1]);
    }
    // Return test payments only to the designated tester; no mutable treasury address.
    function reclaimTestETH() external {
        require(msg.sender == tester, 'Test wallet only');
        (bool ok,) = payable(tester).call{value:address(this).balance}('');
        require(ok, 'Transfer failed');
    }
}
