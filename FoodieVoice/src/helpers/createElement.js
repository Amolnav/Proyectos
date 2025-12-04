function createElement(tagName, className, textContent) {
    const element = document.createElement(tagName)
    if (className) element.classList.add(className)
    if (textContent) element.textContent=textContent
    return element
}

export default createElement