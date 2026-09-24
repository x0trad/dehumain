const vm = require('node:vm');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const code = fs.readFileSync('dist/mint/mint.js', 'utf8');
function setup(provider) {
 const els = {};
 const document = {querySelector(id) { return els[id] ||= {textContent:'',hidden:false,disabled:false,events:{},addEventListener(e,fn){this.events[e]=fn;}}; }};
 const window = {ethereum:provider,addEventListener(){},dispatchEvent(){}};
 vm.runInNewContext(code,{document,window,Event:class {}});
 return els;
}
(async()=>{
 let els=setup(); await els['#connect-wallet'].events.click(); assert.match(els['#wallet-message'].textContent,/No browser wallet/);
 els=setup({request:async()=>{throw {code:4001}}});await els['#connect-wallet'].events.click();assert.match(els['#wallet-message'].textContent,/cancelled/);assert.equal(els['#connect-wallet'].disabled,false);
 const calls=[], events={}; let chain='0x1';
 const provider={on:(k,v)=>events[k]=v,removeListener:k=>delete events[k],request:async({method,params})=>{calls.push(method); if(method==='eth_requestAccounts'||method==='eth_accounts')return ['0x'+'1'.repeat(40)];if(method==='eth_chainId')return chain;if(method==='wallet_switchEthereumChain'){chain=params[0].chainId;return null;}throw Error(method);}};
 els=setup(provider);await els['#connect-wallet'].events.click();assert.equal(els['#switch-network'].hidden,false);await els['#switch-network'].events.click();assert.match(els['#network-status'].textContent,/Connected to Robinhood/);assert.equal(els['#switch-network'].hidden,true);
 events.accountsChanged([]);assert.equal(els['#wallet-address'].textContent,'Not connected');
 assert(!calls.some(x=>/sendTransaction|sign|approve/.test(x)));
 console.log('Passed: missing wallet, rejected request, wrong network, network switch, revoked account, no transaction/signature requests.');
})().catch(e=>{console.error(e);process.exit(1)});
