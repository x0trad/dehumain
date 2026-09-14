// Set this to the collection's mint page when minting is ready.
const MINT_URL = "";
document.querySelector("#year").textContent = String(new Date().getFullYear());

document.querySelector(".mint").addEventListener("click", () => {
  if (MINT_URL) {
    window.location.assign(MINT_URL);
    return;
  }
  document.querySelector("#mint-status").textContent = "Minting opens soon.";
});
