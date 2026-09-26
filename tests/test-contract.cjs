const assert=require('node:assert/strict');
const ganache=require('ganache');
const {BrowserProvider,ContractFactory,parseEther}=require('ethers');
const artifact=require('../dist/test-mint/contract.json');
(async()=>{
 const rpc=ganache.provider({chain:{chainId:1337},logging:{quiet:true}});
 const provider=new BrowserProvider(rpc, undefined, {cacheTimeout:-1});const tester=await provider.getSigner(0),other=await provider.getSigner(1);
 const nft=await new ContractFactory(artifact.abi,artifact.bytecode,tester).deploy(await tester.getAddress(),['ipfs://test/1','ipfs://test/2','ipfs://test/3']);await nft.waitForDeployment();
 await assert.rejects(nft.connect(other).mint());
 await assert.rejects(nft.mint({value:parseEther('0.0001')}));
 await (await nft.mint()).wait();assert.equal(await nft.ownerOf(1),await tester.getAddress());assert.equal(await nft.tokenURI(1),'ipfs://test/1');
 await (await nft.transferFrom(await tester.getAddress(),await other.getAddress(),1)).wait();
 await assert.rejects(async()=>{const tx=await nft.mint({gasLimit:300000});await tx.wait();}); // transferring away does not reset free mint
 await assert.rejects(nft.mint({value:1}));
 await (await nft.mint({value:parseEther('0.0001')})).wait();
 await (await nft.mint({value:parseEther('0.0001')})).wait();
 assert.equal(await nft.minted(),3n);assert.equal(await nft.mintCount(await tester.getAddress()),3n);
 await assert.rejects(nft.mint({value:parseEther('0.0001')}));await assert.rejects(nft.connect(other).reclaimTestETH());
 await (await nft.reclaimTestETH()).wait();assert.equal(BigInt(await rpc.request({method:'eth_getBalance',params:[await nft.getAddress(),'latest']})),0n);
 await rpc.disconnect();
 const mainnet=ganache.provider({chain:{chainId:4663},logging:{quiet:true}});const signer=await new BrowserProvider(mainnet).getSigner();
 await assert.rejects(new ContractFactory(artifact.abi,artifact.bytecode,signer).deploy(await signer.getAddress(),['a','b','c']));await mainnet.disconnect();
 console.log('Passed: wallet gate, first-free mint, exact paid price, metadata, transfer does not reset eligibility, supply cap, refund permissions and mainnet deployment rejection.');
})().catch(e=>{console.error(e);process.exit(1)});
