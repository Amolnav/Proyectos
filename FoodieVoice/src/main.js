import App from './App'
import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  const appDiv = document.getElementById("app")
  const app = App()
  appDiv.appendChild(app.element)

})