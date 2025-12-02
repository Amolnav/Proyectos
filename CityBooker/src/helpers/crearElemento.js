function crearElemento(tag, className, textContent) {
    const elemento = document.createElement(tag)
    if (className) elemento.classList.add(className)
    if (textContent) elemento.textContent = textContent
    return elemento
}

export default crearElemento