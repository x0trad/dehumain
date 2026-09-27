const {getAddress}=require('ethers');
const types={MintQuote:[{name:'buyer',type:'address'},{name:'nonce',type:'uint256'},{name:'minimumBalance',type:'uint256'},{name:'price',type:'uint256'},{name:'issuedAt',type:'uint256'},{name:'deadline',type:'uint256'}]};
const USD=10n**18n;
const ceilDiv=(a,b)=>(a+b-1n)/b;
// A reviewed adapter must supply manipulation-resistant prices, not browser values.
async function createQuote({buyer,chainId,contractAddress,tokenAddress,token,nft,prices,signer,now=Math.floor(Date.now()/1000)}) {
 buyer=getAddress(buyer);
 if(await nft.paused())throw Error('Mint is paused');
 const p=await prices.read();
 if(!p.graduated)throw Error('Token has not graduated');
 if(p.chainId!==chainId || getAddress(p.token)!==getAddress(tokenAddress))throw Error('Price source mismatch');
 if(!Number.isInteger(p.observedAt)||p.observedAt>now||now-p.observedAt>60)throw Error('Price data is stale');
 const tokenUsd=BigInt(p.tokenUsd18),ethUsd=BigInt(p.ethUsd18);
 if(tokenUsd<=0n||ethUsd<=0n)throw Error('Invalid price');
 const decimals=Number(await token.decimals());
 if(!Number.isInteger(decimals)||decimals<0||decimals>36)throw Error('Unsupported decimals');
 const minimumBalance=ceilDiv(5n*USD*10n**BigInt(decimals),tokenUsd);
 const nonce=await nft.mintCount(buyer);
 if(await token.balanceOf(buyer)<minimumBalance)throw Error('Hold at least US$5 of Dehumain token');
 if(await nft.minted()>=await nft.maxSupply()||nonce>=await nft.walletLimit())throw Error('Mint limit reached');
 const quote={buyer,nonce:nonce.toString(),minimumBalance:minimumBalance.toString(),price:(nonce===0n?0n:ceilDiv(5n*USD*10n**18n,ethUsd)).toString(),issuedAt:now,deadline:now+60};
 const domain={name:'DehumainMint',version:'1',chainId,verifyingContract:contractAddress};
 return {quote,signature:await signer.signTypedData(domain,types,quote),chainId,contractAddress};
}
module.exports={createQuote,types};
