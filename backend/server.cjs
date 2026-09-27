const http=require('node:http');
const {JsonRpcProvider,Wallet,Contract,getAddress}=require('ethers');
const {createQuote}=require('./quotes.cjs');
async function start(){
 const enabled=process.env.MINT_ENABLED==='true';
 let context;
 if(enabled){
  for(const name of ['RPC_URL','NFT_ADDRESS','TOKEN_ADDRESS','QUOTE_SIGNER_KEY','PRICE_ADAPTER_MODULE'])if(!process.env[name])throw Error(`Missing ${name}`);
  const provider=new JsonRpcProvider(process.env.RPC_URL);
  const chainId=Number((await provider.getNetwork()).chainId);
  if(chainId!==4663)throw Error('Production service requires Robinhood Chain 4663');
  const artifact=require('../build/Dehumain.json');
  const contractAddress=getAddress(process.env.NFT_ADDRESS),tokenAddress=getAddress(process.env.TOKEN_ADDRESS);
  const nft=new Contract(contractAddress,artifact.abi,provider);
  const signer=new Wallet(process.env.QUOTE_SIGNER_KEY);
  if(getAddress(await nft.quoteSigner())!==signer.address||getAddress(await nft.eligibilityToken())!==tokenAddress)throw Error('Contract configuration mismatch');
  const token=new Contract(tokenAddress,['function balanceOf(address) view returns(uint256)','function decimals() view returns(uint8)'],provider);
  const prices=require(require('node:path').resolve(process.env.PRICE_ADAPTER_MODULE));
  if(typeof prices.read!=='function')throw Error('Price adapter must export read()');
  context={chainId,contractAddress,tokenAddress,nft,token,signer,prices};
 }
 // Bind locally. Put behind HTTPS reverse proxy and rate limiting before public hosting.
 http.createServer(async(req,res)=>{
  res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
  const url=new URL(req.url,'http://localhost');
  if(req.method==='GET'&&url.pathname==='/health'){res.end(JSON.stringify({status:enabled?'configured':'disabled'}));return;}
  if(req.method!=='GET'||url.pathname!=='/quote'){res.statusCode=404;res.end('{}');return;}
  if(!context){res.statusCode=503;res.end(JSON.stringify({error:'Mint is not configured or open'}));return;}
  try {res.end(JSON.stringify(await createQuote({...context,buyer:url.searchParams.get('buyer')})));}
  catch {res.statusCode=503;res.end(JSON.stringify({error:'Quote unavailable. Check eligibility or try again later.'}));}
 }).listen(Number(process.env.PORT||8788),'127.0.0.1',()=>console.log(`Mint quote service: ${enabled?'configured':'disabled'}`));
}
start().catch(()=>{console.error('Mint service startup failed. Check configuration and RPC connectivity.');process.exit(1);});
