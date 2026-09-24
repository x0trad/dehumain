document.querySelector("#year").textContent = String(new Date().getFullYear());
document.querySelector(".mint").addEventListener("click", () => {
  window.location.assign("./mint/");
});
