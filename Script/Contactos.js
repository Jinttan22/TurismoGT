document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Formulario enviado con éxito.");
    this.reset();
  });
  