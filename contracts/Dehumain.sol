// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/access/Ownable2Step.sol';
import '@openzeppelin/contracts/utils/Pausable.sol';
import '@openzeppelin/contracts/utils/ReentrancyGuard.sol';
import '@openzeppelin/contracts/utils/cryptography/EIP712.sol';
import '@openzeppelin/contracts/utils/cryptography/ECDSA.sol';
import '@openzeppelin/contracts/utils/Strings.sol';

/// @notice Production candidate. Quotes trust a server signer for USD valuation.
/// Starts paused; deployment and launch require finalized configuration and review.
contract Dehumain is ERC721, Ownable2Step, Pausable, ReentrancyGuard, EIP712 {
    using Strings for uint256;
    struct Quote { address buyer; uint256 nonce; uint256 minimumBalance; uint256 price; uint256 issuedAt; uint256 deadline; }
    bytes32 private constant QUOTE_TYPEHASH = keccak256('MintQuote(address buyer,uint256 nonce,uint256 minimumBalance,uint256 price,uint256 issuedAt,uint256 deadline)');
    IERC20 public immutable eligibilityToken;
    address payable public immutable treasury;
    uint256 public immutable maxSupply;
    uint256 public immutable walletLimit;
    address public quoteSigner;
    uint256 public minted;
    mapping(address => uint256) public mintCount;
    string private metadataBase;
    bool public metadataFrozen;
    event QuoteSignerUpdated(address signer);
    event MetadataUpdated(string uri);
    event MetadataFrozen();
    constructor(address admin, address token, address payable treasury_, address signer, uint256 supply, uint256 limit, string memory uri)
        ERC721('Dehumain','DEHUMAIN') Ownable(admin) EIP712('DehumainMint','1') {
        require(token.code.length > 0 && treasury_ != address(0) && signer != address(0), 'Invalid addresses');
        require(supply > 0 && limit > 0 && limit <= supply, 'Invalid limits');
        require(bytes(uri).length > 0, 'Missing metadata');
        eligibilityToken = IERC20(token); treasury = treasury_; quoteSigner = signer;
        maxSupply = supply; walletLimit = limit; metadataBase = uri; _pause();
    }
    function mint(Quote calldata q, bytes calldata signature) external payable whenNotPaused nonReentrant {
        require(q.buyer == msg.sender && q.nonce == mintCount[msg.sender], 'Invalid buyer or nonce');
        require(q.issuedAt <= block.timestamp && q.deadline >= block.timestamp && q.deadline > q.issuedAt && q.deadline - q.issuedAt <= 120, 'Expired or invalid quote');
        require(q.minimumBalance > 0, 'Invalid threshold');
        bytes32 hash = keccak256(abi.encode(QUOTE_TYPEHASH,q.buyer,q.nonce,q.minimumBalance,q.price,q.issuedAt,q.deadline));
        require(ECDSA.recover(_hashTypedDataV4(hash),signature) == quoteSigner, 'Invalid signature');
        require(eligibilityToken.balanceOf(msg.sender) >= q.minimumBalance, 'Insufficient token holding');
        require(minted < maxSupply && q.nonce < walletLimit, 'Mint limit reached');
        require((q.nonce == 0 ? q.price == 0 : q.price > 0) && msg.value == q.price, 'Incorrect payment');
        mintCount[msg.sender]++; _safeMint(msg.sender,++minted);
    }
    function setPaused(bool value) external onlyOwner { if(value) _pause(); else _unpause(); }
    function setQuoteSigner(address signer) external onlyOwner { require(signer != address(0), 'Invalid signer'); quoteSigner=signer; emit QuoteSignerUpdated(signer); }
    function setMetadataBase(string calldata uri) external onlyOwner whenPaused { require(!metadataFrozen && bytes(uri).length > 0, 'Metadata locked or empty'); metadataBase=uri; emit MetadataUpdated(uri); }
    function freezeMetadata() external onlyOwner { require(!metadataFrozen,'Already frozen'); metadataFrozen=true; emit MetadataFrozen(); }
    function tokenURI(uint256 id) public view override returns(string memory) {
        _requireOwned(id);
        string memory number=id.toString();
        while(bytes(number).length < 4) number=string.concat('0',number);
        return string.concat(metadataBase,number,'.json');
    }
    function withdraw() external onlyOwner nonReentrant { (bool ok,)=treasury.call{value:address(this).balance}(''); require(ok,'Withdrawal failed'); }
}
