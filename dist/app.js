// Set this to the collection's mint page when minting is ready.
const MINT_URL = "";
document.querySelector("#year").textContent = String(new Date().getFullYear());

const mintButton = document.querySelector(".mint");
const updateMintLabel = () => {
  mintButton.textContent = !MINT_URL && (mintButton.matches(":hover") || document.activeElement === mintButton)
    ? "Coming Soon"
    : "Mint";
};
for (const event of ["mouseenter", "mouseleave", "focus", "blur"]) {
  mintButton.addEventListener(event, updateMintLabel);
}

document.querySelector(".mint").addEventListener("click", () => {
  if (MINT_URL) {
    window.location.assign(MINT_URL);
    return;
  }
  document.querySelector("#mint-status").textContent = "Minting opens soon.";
});
