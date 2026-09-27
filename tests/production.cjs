const assert=require('node:assert/strict'),ganache=require('ganache'),solc=require('solc');
const {BrowserProvider,Wallet,ContractFactory}=require('ethers');
const {createQuote,types}=require('../backend/quotes.cjs');
(async()=>{
 const rpc=ganache.provider({logging:{quiet:true},chain:{chainId:1337}});
 try {
 const provider=new BrowserProvider(rpc,undefined,{cacheTimeout:-1});
 const admin=await provider.getSigner(0),buyer=await provider.getSigner(1),other=await provider.getSigner(2),authority=Wallet.createRandom();
 const input={language:'Solidity',sources:{'T.sol':{content:'pragma solidity ^0.8.24; contract T { uint8 public decimals=18; mapping(address=>uint256) public balanceOf; function set(address a,uint256 n) external {balanceOf[a]=n;} }'}},settings:{evmVersion:'paris',outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}};
 const t=JSON.parse(solc.compile(JSON.stringify(input))).contracts['T.sol'].T;
 const token=await new ContractFactory(t.abi,'0x'+t.evm.bytecode.object,admin).deploy();await token.waitForDeployment();
 const artifact=require('../build/Dehumain.json');
 const nft=await new ContractFactory(artifact.abi,artifact.bytecode,admin).deploy(await admin.getAddress(),await token.getAddress(),await admin.getAddress(),authority.address,3,2,'ipfs://metadata/');await nft.waitForDeployment();
 const address=await buyer.getAddress();await(await token.set(address,10n**18n)).wait();
 const now=Number((await provider.getBlock('latest')).timestamp);
 const p={graduated:true,chainId:1337,token:await token.getAddress(),observedAt:now,tokenUsd18:(5n*10n**18n).toString(),ethUsd18:(2500n*10n**18n).toString()};
 const context={buyer:address,chainId:1337,contractAddress:await nft.getAddress(),tokenAddress:await token.getAddress(),token,nft,signer:authority,prices:{read:async()=>p},now};
 await assert.rejects(createQuote(context),/paused/);
 await(await nft.setPaused(false)).wait();
 const free=await createQuote(context);assert.equal(free.quote.price,'0');
 await assert.rejects(nft.connect(other).mint(free.quote,free.signature));
 await assert.rejects(nft.connect(buyer).mint({...free.quote,minimumBalance:1},free.signature));
 await(await token.set(address,0)).wait();await assert.rejects(nft.connect(buyer).mint(free.quote,free.signature));
 await(await token.set(address,10n**18n)).wait();
 await(await nft.connect(buyer).mint(free.quote,free.signature,{gasLimit:500000})).wait();
 assert.equal(await nft.tokenURI(1),'ipfs://metadata/0001.json');
 await assert.rejects(nft.connect(buyer).mint(free.quote,free.signature));
 await(await nft.connect(buyer).transferFrom(address,await other.getAddress(),1)).wait();
 const paid=await createQuote(context);assert.equal(paid.quote.price,'2000000000000000');
 await assert.rejects(nft.connect(buyer).mint(paid.quote,paid.signature,{value:1}));
 await(await nft.connect(buyer).mint(paid.quote,paid.signature,{value:paid.quote.price})).wait();
 await assert.rejects(createQuote(context),/limit/);
 await assert.rejects(nft.connect(other).withdraw());await(await nft.withdraw()).wait();
 await assert.rejects(createQuote({...context,prices:{read:async()=>({...p,observedAt:now-61})}}),/stale/);
 await assert.rejects(createQuote({...context,prices:{read:async()=>({...p,graduated:false})}}),/graduated/);
 await(await nft.freezeMetadata()).wait();await(await nft.setPaused(true)).wait();
 await assert.rejects(nft.setMetadataBase('ipfs://changed/'));
 // Wrong chain signatures and expired quotes cannot be used even by an eligible new wallet.
 await(await nft.setPaused(false)).wait();const otherAddress=await other.getAddress();await(await token.set(otherAddress,10n**18n)).wait();
 const q=(await createQuote({...context,buyer:otherAddress})).quote;
 const wrong=await authority.signTypedData({name:'DehumainMint',version:'1',chainId:4663,verifyingContract:await nft.getAddress()},types,q);
 await assert.rejects(nft.connect(other).mint(q,wrong));
 const old={...q,issuedAt:now-300,deadline:now-240};const sig=await authority.signTypedData({name:'DehumainMint',version:'1',chainId:1337,verifyingContract:await nft.getAddress()},types,old);
 await assert.rejects(nft.connect(other).mint(old,sig));
 console.log('Production candidate checks passed: eligibility, pricing, replay/tamper/chain/expiry rejection, wallet limits, metadata and treasury controls.');
 } finally {await rpc.disconnect();}
})().catch(e=>{console.error(e);process.exit(1)});
