/* Testnet-only rehearsal. No private keys, approvals, price feeds or production contract. */
const $=id=>document.getElementById(id);
const TESTER='0x7dae73bfb82c7ad059d9c135532283c9b7e48e27';
const CHAIN='0xb626'; // 46630
let wallet, signer, account, nft, artifact, collection, busy=false, correct=false;
const say=text=>$('status').textContent=text;
$('tester').textContent=TESTER;
function controls(){
 const ready=!!artifact&&!!collection&&!!signer&&correct&&account?.toLowerCase()===TESTER;
 for(const id of ['load','deploy'])$(id).disabled=busy||!ready;
 $('mint').disabled=busy||!ready||!nft;
 $('refund').disabled=busy||!ready||!nft;
 $('connect').disabled=busy; $('switch').disabled=busy;
}
async function run(fn){if(busy)return;busy=true;controls();try{await fn();}catch(e){say(e.code===4001||e.code==='ACTION_REJECTED'?'Cancelled in wallet. Nothing else was requested.':(e.shortMessage||e.message||'Request failed.'));}finally{busy=false;controls();}}
async function sync(){
 nft=null; signer=null; correct=false;
 $('supply').textContent='Load a test contract to check supply.';
 const accounts=await wallet.request({method:'eth_accounts'}); account=accounts[0];
 $('wallet').textContent=account||'Not connected';
 const chain=await wallet.request({method:'eth_chainId'});correct=chain.toLowerCase()===CHAIN;
 $('switch').hidden=correct||!account;
 if(account&&correct)signer=await new ethers.BrowserProvider(wallet).getSigner(account);
 say(!account?'Wallet disconnected.':!correct?'Switch to Robinhood Chain testnet.':account.toLowerCase()!==TESTER?'This wallet is not the designated tester.':'Test wallet ready. Deploy once, or load an existing test contract.');controls();
}
async function checkWallet(){
 const accounts=await wallet.request({method:'eth_accounts'}), chain=await wallet.request({method:'eth_chainId'});
 if(chain.toLowerCase()!==CHAIN||accounts[0]?.toLowerCase()!==TESTER)throw Error('Select the designated wallet on Robinhood Chain testnet.');
}
async function stats(){
 const [minted,count]=await Promise.all([nft.minted(),nft.mintCount(TESTER)]);
 $('supply').textContent=`${minted} / 3 minted. Your next mint: ${count===0n?'free + testnet gas':'0.0001 test ETH + testnet gas'}.`;
 $('mint').textContent=minted>=3n?'All three minted':count===0n?'Mint first NFT · free + test gas':'Mint next NFT · 0.0001 test ETH';
 if(minted>=3n){$('supply').textContent='All 3 test NFTs minted.';}
 return {minted,count};
}
function receipt(hash){const a=document.createElement('a');a.href=`https://explorer.testnet.chain.robinhood.com/tx/${hash}`;a.target='_blank';a.rel='noopener';a.textContent='View transaction ↗';$('receipt').replaceChildren(a);}
$('connect').onclick=()=>run(async()=>{
 if(!window.ethereum?.request)throw Error('Open this page in a browser with your wallet extension enabled.');
 if(wallet!==window.ethereum){wallet=window.ethereum;wallet.on?.('accountsChanged',()=>sync().catch(e=>say(e.message)));wallet.on?.('chainChanged',()=>sync().catch(e=>say(e.message)));}
 await wallet.request({method:'eth_requestAccounts'});await sync();
});
$('switch').onclick=()=>run(async()=>{
 try{await wallet.request({method:'wallet_switchEthereumChain',params:[{chainId:CHAIN}]});}catch(e){if(e.code!==4902)throw e;await wallet.request({method:'wallet_addEthereumChain',params:[{chainId:CHAIN,chainName:'Robinhood Chain Testnet',nativeCurrency:{name:'Test Ether',symbol:'ETH',decimals:18},rpcUrls:['https://rpc.testnet.chain.robinhood.com'],blockExplorerUrls:['https://explorer.testnet.chain.robinhood.com']}]});}
 await sync();
});
$('load').onclick=()=>run(async()=>{
 await checkWallet(); const target=$('contract').value.trim();if(!ethers.isAddress(target))throw Error('Enter a valid test contract address.');
 const code=await signer.provider.getCode(target);if(code==='0x')throw Error('No contract exists at this address. A wallet address cannot be used as the test contract address.');
 const candidate=new ethers.Contract(target,artifact.abi,signer);
 if((await candidate.tester()).toLowerCase()!==TESTER||await candidate.MAX_SUPPLY()!==3n||await candidate.PAID_PRICE()!==ethers.parseEther('0.0001')||await candidate.name()!=='Dehumain Test')throw Error('This contract does not match the test configuration.');
 nft=candidate;await stats();say('Test collection loaded. Review the price before minting.');
});
$('deploy').onclick=()=>run(async()=>{
 await checkWallet();const base=new URL($('base').value);if(base.protocol!=='https:')throw Error('Artwork must have a public HTTPS URL.');if(!base.pathname.endsWith('/'))base.pathname+='/';
 const uris=[];
 for(let i=0;i<3;i++){
   const image=new URL(`${i+1}.png`,base).href;
   await new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=()=>reject(Error(`Artwork ${i+1} is not accessible. Publish the test images first.`));img.src=image;});
   const metadata={...collection[i],image};uris.push('data:application/json;base64,'+btoa(unescape(encodeURIComponent(JSON.stringify(metadata)))));
 }
 await checkWallet();say('Review the test collection deployment in your wallet.');
 const deployed=await new ethers.ContractFactory(artifact.abi,artifact.bytecode,signer).deploy(TESTER,uris);
 receipt(deployed.deploymentTransaction().hash);say('Deployment submitted. Waiting for testnet confirmation…');await deployed.waitForDeployment();
 $('contract').value=await deployed.getAddress();nft=deployed;await stats();say('Test contract deployed. Copy its address to reuse it. You can now mint your first NFT.');
});
$('mint').onclick=()=>run(async()=>{
 await checkWallet();const active=nft;const {minted,count}=await stats();if(minted>=3n)throw Error('All three test NFTs have been minted.');
 say('Review the mint in your wallet. Testnet ETH only.');const tx=await active.mint({value:count===0n?0n:ethers.parseEther('0.0001')});receipt(tx.hash);say('Mint submitted. Waiting for confirmation…');await tx.wait();if(nft===active)await stats();say('Mint confirmed. The NFT is in your test wallet.');
});
$('refund').onclick=()=>run(async()=>{await checkWallet();const tx=await nft.reclaimTestETH();receipt(tx.hash);await tx.wait();say('Test mint payments returned to your wallet. Gas fees are not refundable.');});
Promise.all([fetch('contract.json').then(r=>{if(!r.ok)throw Error('Contract artifact unavailable');return r.json();}),fetch('collection.json').then(r=>{if(!r.ok)throw Error('Collection unavailable');return r.json();})]).then(([a,c])=>{
 artifact=a;collection=c;
 for(const item of c){const card=document.createElement('article');card.className='card';const img=document.createElement('img');img.src=item.image;img.alt=item.name;const title=document.createElement('h2');title.textContent=item.name;const dl=document.createElement('dl');for(const trait of item.attributes){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=trait.trait_type;dd.textContent=trait.value;row.append(dt,dd);dl.append(row);}card.append(img,title,dl);$('gallery').append(card);}
}).catch(e=>{say(e.message);$('connect').disabled=true;});
