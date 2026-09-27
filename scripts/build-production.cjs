const fs=require('node:fs'), solc=require('solc');
const input={language:'Solidity',sources:{'Dehumain.sol':{content:fs.readFileSync('contracts/Dehumain.sol','utf8')}},settings:{optimizer:{enabled:true,runs:200},evmVersion:'paris',outputSelection:{'*':{'*':['abi','evm.bytecode.object']}}}};
const output=JSON.parse(solc.compile(JSON.stringify(input),{import:p=>({contents:fs.readFileSync('node_modules/'+p,'utf8')})}));
for(const e of output.errors||[])if(e.severity==='error')throw Error(e.formattedMessage);
const c=output.contracts['Dehumain.sol'].Dehumain;
fs.mkdirSync('build',{recursive:true});fs.writeFileSync('build/Dehumain.json',JSON.stringify({abi:c.abi,bytecode:'0x'+c.evm.bytecode.object},null,2));
console.log('Built production candidate (not deployed).');
