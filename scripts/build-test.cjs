const fs=require('node:fs');
const solc=require('solc');
const input={language:'Solidity',sources:{'DehumainTest.sol':{content:fs.readFileSync('contracts/DehumainTest.sol','utf8')}},settings:{optimizer:{enabled:true,runs:200},evmVersion:'paris',outputSelection:{'*':{'*':['abi','evm.bytecode.object','evm.deployedBytecode.object']}}}};
const output=JSON.parse(solc.compile(JSON.stringify(input),{import:p=>({contents:fs.readFileSync('node_modules/'+p,'utf8')})}));
for(const e of output.errors||[]) if(e.severity==='error')throw Error(e.formattedMessage);
const c=output.contracts['DehumainTest.sol'].DehumainTest;
fs.writeFileSync('dist/test-mint/contract.json',JSON.stringify({abi:c.abi,bytecode:'0x'+c.evm.bytecode.object,runtimeBytecode:'0x'+c.evm.deployedBytecode.object},null,2));
fs.copyFileSync('node_modules/ethers/dist/ethers.umd.min.js','dist/test-mint/vendor/ethers.js');
console.log('Built test contract and browser library.');
