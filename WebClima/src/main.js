import App from "./App"

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app")
  const appDiv = App();
  app.appendChild(appDiv)
})