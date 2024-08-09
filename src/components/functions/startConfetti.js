const startConfetti = () => {
  const confettiContainer = document.getElementById("confetti");
  confettiContainer.innerHTML = "";

  const numberOfConfetti = 225;
  const colors = ["#ff0", "#f00", "#0f0", "#00f", "#0ff", "#f0f"];

  for (let i = 0; i < numberOfConfetti; i++) {
    const confettiPiece = document.createElement("div");
    confettiPiece.classList.add("confetti");
    confettiPiece.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    confettiPiece.style.width = `${Math.random() * 10 + 5}px`;
    confettiPiece.style.height = confettiPiece.style.width;
    confettiPiece.style.left = `${Math.random() * 100}vw`;
    confettiPiece.style.animationDelay = `${Math.random() * 2000}ms`;
    confettiContainer.appendChild(confettiPiece);
  }
}

export default startConfetti;