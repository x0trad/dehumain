// Wallet preparation only. No transactions or signature requests until contracts and launch rules are reviewed.
const connect = document.querySelector('#connect-wallet');
const disconnect = document.querySelector('#disconnect-wallet');
const switchButton = document.querySelector('#switch-network');
const address = document.querySelector('#wallet-address');
const network = document.querySelector('#network-status');
const message = document.querySelector('#wallet-message');
const chainId = '0x1237'; // Robinhood Chain mainnet: 4663
let provider = null;
let connected = false;
let generation = 0;
const wallets = new Map();
window.addEventListener('eip6963:announceProvider', ({ detail }) => {
  if (detail?.info?.uuid && detail?.provider?.request) wallets.set(detail.info.uuid, detail);
});
window.dispatchEvent(new Event('eip6963:requestProvider'));
function reset() {
  generation++;
  connected = false;
  provider?.removeListener?.('accountsChanged', accountsChanged);
  provider?.removeListener?.('chainChanged', chainChanged);
  provider?.removeListener?.('disconnect', providerDisconnected);
  provider = null;
  address.textContent = 'Not connected';
  network.textContent = 'Connect a browser wallet to check your network.';
  connect.hidden = false; disconnect.hidden = true; switchButton.hidden = true;
}
function showError(error) {
  message.textContent = error?.code === 4001 ? 'Request cancelled. You can try again when ready.' : error?.code === -32002 ? 'A wallet request is already open. Check your wallet.' : 'Could not connect to the wallet or network. Check your wallet and try again.';
}
async function refresh(accounts) {
  const current = generation;
  const activeProvider = provider;
  if (!activeProvider) return;
  const list = accounts ?? await activeProvider.request({ method: 'eth_accounts' });
  if (current !== generation) return;
  if (!list?.length) { reset(); return; }
  address.textContent = list[0];
  const chain = await activeProvider.request({ method: 'eth_chainId' });
  if (current !== generation) return;
  const correct = chain.toLowerCase() === chainId;
  network.textContent = correct ? 'Connected to Robinhood Chain. Minting is not open.' : 'Your wallet is on another network. Switch to Robinhood Chain to prepare.';
  switchButton.hidden = correct;
  connect.hidden = true; disconnect.hidden = false;
}
const accountsChanged = accounts => { if (connected) refresh(accounts).catch(showError); };
const chainChanged = () => { if (connected) refresh().catch(showError); };
const providerDisconnected = () => { reset(); message.textContent = 'Your wallet disconnected.'; };
connect.addEventListener('click', async () => {
  message.textContent = '';
  provider = window.ethereum?.request ? window.ethereum : [...wallets.values()][0]?.provider;
  if (!provider) { message.textContent = 'No browser wallet detected. Open this page in your wallet’s browser or enable a compatible wallet extension.'; return; }
  connect.disabled = true; connect.textContent = 'Waiting for wallet…';
  try {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });
    connected = true;
    provider.on?.('accountsChanged', accountsChanged);
    provider.on?.('chainChanged', chainChanged);
    provider.on?.('disconnect', providerDisconnected);
    await refresh(accounts);
  } catch (error) { reset(); showError(error); }
  finally { connect.disabled = false; connect.textContent = 'Connect wallet'; }
});
switchButton.addEventListener('click', async () => {
  if (!provider) return;
  switchButton.disabled = true; message.textContent = '';
  try {
    try { await provider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] }); }
    catch (error) {
      if (error.code !== 4902) throw error;
      await provider.request({ method: 'wallet_addEthereumChain', params: [{ chainId, chainName: 'Robinhood Chain', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, rpcUrls: ['https://rpc.mainnet.chain.robinhood.com/'], blockExplorerUrls: ['https://robinhoodchain.blockscout.com/'] }] });
    }
    await refresh();
  } catch (error) { showError(error); }
  finally { switchButton.disabled = false; }
});
disconnect.addEventListener('click', () => { reset(); message.textContent = 'Disconnected from this page. Manage site permissions in your wallet to revoke access.'; });
