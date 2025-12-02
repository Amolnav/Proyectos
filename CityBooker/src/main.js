import App from './App'
import './style.css'

document.addEventListener("DOMContentLoaded", () => {
  const appDiv = document.getElementById("app")
  App().then((container) => {
    appDiv.append(container)
  })
})
