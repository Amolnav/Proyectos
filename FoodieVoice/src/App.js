import createElement from "./helpers/createElement";
import localStorageManager from "./helpers/localStorageManager";
import obtenerMejorRestaurante from "./helpers/obtenerMejorRestaurante";

function App() {
    const reseñas = localStorageManager().cargar()
    const container = createElement("div","fullContainer")
    const mainContainer = createElement("div","mainContainer")
    let calificacionSeleccionada = 0
    
    // ==================== HEADER ====================
    function crearHeader() {
        const header = createElement("header","header")
        const title = createElement("h2","title","FoodieVoice")
        const addReseña = createElement("button", "reseñaButton", "Añadir Reseña")
        
        addReseña.addEventListener('click', () => {
            cargarFormulario()
        })
        
        header.append(title, addReseña)
        return header
    }
    
    // ==================== SIDEBAR ====================
    function crearSidebar() {
        const sidebar = createElement("form", "sidebar")
        const filtrosTitle = createElement("p", "filtrosTitle")
        const filtrosCalificacionP = createElement("p", "filtrosP","Calificacion:")
        const filtrosCalificacionEstrellas = crearEstrellasFiltro()
        const filtrosCategoriasTitle = createElement("p","filtrosCategoriasTitle","Categoria:")
        const filtrosCategorias = createElement("div","filtrosCategorias")
        const buscar = createElement("button","buscarFiltros","Buscar")
        buscar.type = "button"
        
        buscar.addEventListener("click", (e) => {
            e.preventDefault()
            aplicarFiltros()
        })
        
        sidebar.append(
            filtrosTitle, 
            filtrosCalificacionP, 
            filtrosCalificacionEstrellas, 
            filtrosCategoriasTitle, 
            filtrosCategorias, 
            buscar
        )
        
        return sidebar
    }
    
    function crearEstrellasFiltro() {
        const filtrosCalificacionEstrellas = createElement("div","estrellas")
        
        for (let i = 0; i < 5; i++) {
            const estrella = createElement("p","estrella","★")
            estrella.id = `estrella${i}`
            filtrosCalificacionEstrellas.append(estrella)
        }
        
        return filtrosCalificacionEstrellas
    }
    
    function configurarEventosEstrellas() {
        const estrellas = mainContainer.querySelectorAll(".estrella")
        
        estrellas.forEach((estrella, index) => {
            estrella.addEventListener("click", () => {
                calificacionSeleccionada = index + 1
                estrellas.forEach((e, i) => {
                    if (i < calificacionSeleccionada) {
                        e.classList.add("estrella-activa")
                    } else {
                        e.classList.remove("estrella-activa")
                    }
                })
            })
        })
    }
    
    // ==================== SECCIÓN DE RESEÑAS ====================
    function crearSeccionReseñas() {
        const reseñasDiv = createElement("div", "reseñasDiv")
        const reseñasDivFijo = crearBarraOrdenamiento()
        const reseñasDivDinamico = createElement("div", "reseñasDivDinamico")
        
        reseñasDiv.append(reseñasDivFijo, reseñasDivDinamico)
        return reseñasDiv
    }
    
    function crearBarraOrdenamiento() {
        const reseñasDivFijo = createElement("div","reseñasDivFijo")
        const reseñasLabel = createElement("label","reseñasLabel","Ordernar por:")
        const reseñasSelect = createElement("select","reseñasSelect")
        
        const opciones = ["Mas Reciente", "Mas Antigua", "Mejor Valoracion","Peor Valoracion"]
        opciones.forEach((ordenacion) => {
            const option = document.createElement("option")
            option.textContent = ordenacion
            option.value = ordenacion
            reseñasSelect.append(option)
        })
        
        reseñasSelect.addEventListener("change", (e) => {
            const filtrosActuales = obtenerFiltrosActivos()
            cargarReseñas(e.target.value, filtrosActuales)
        })
        
        reseñasDivFijo.append(reseñasLabel, reseñasSelect)
        return reseñasDivFijo
    }
    
    function cargarReseñas(orden, filtros = null) {
        const reseñasDivDinamico = mainContainer.querySelector(".reseñasDivDinamico")
        reseñasDivDinamico.innerHTML = ""
        
        let reseñasOrdenadas = [...reseñas]
        
        // Aplicar filtros
        if (filtros) {
            reseñasOrdenadas = aplicarFiltrosAReseñas(reseñasOrdenadas, filtros)
        }
        
        // Ordenar
        reseñasOrdenadas = ordenarReseñas(reseñasOrdenadas, orden)
        
        // Renderizar
        if (reseñasOrdenadas.length === 0) {
            mostrarMensajeSinResultados(reseñasDivDinamico)
        } else {
            renderizarReseñas(reseñasOrdenadas, reseñasDivDinamico)
        }
    }
    
    function aplicarFiltrosAReseñas(reseñas, filtros) {
        let resultado = reseñas
        
        if (filtros.calificacion > 0) {
            resultado = resultado.filter(r => Number(r.valoracion) >= filtros.calificacion)
        }
        
        if (filtros.categorias.length > 0) {
            resultado = resultado.filter(r => filtros.categorias.includes(r.categoria))
        }
        
        return resultado
    }
    
    function ordenarReseñas(reseñas, orden) {
        const copiaReseñas = [...reseñas]
        
        switch (orden) {
            case "Mas Reciente":
                return copiaReseñas.sort((a, b) => b.fecha - a.fecha)
            case "Mas Antigua":
                return copiaReseñas.sort((a, b) => a.fecha - b.fecha)
            case "Mejor Valoracion":
                return copiaReseñas.sort((a, b) => Number(b.valoracion) - Number(a.valoracion))
            case "Peor Valoracion":
                return copiaReseñas.sort((a, b) => Number(a.valoracion) - Number(b.valoracion))
            default:
                return copiaReseñas
        }
    }
    
    function mostrarMensajeSinResultados(contenedor) {
        const mensaje = createElement("p", "noResultados", "No se encontraron reseñas con estos filtros")
        contenedor.append(mensaje)
    }
    
    function renderizarReseñas(reseñas, contenedor) {
        reseñas.forEach((reseña) => {
            const card = crearTarjetaReseña(reseña)
            contenedor.append(card)
        })
    }
    
    function crearTarjetaReseña(reseña) {
        const reseñaCard = createElement("div", "reseñaCard")
        const restaurante = createElement("h3", "restaurante", reseña.restaurante)
        const categoria = createElement("p", "categoriaCard", reseña.categoria)
        const estrellas = "★".repeat(reseña.valoracion) + "☆".repeat(5 - reseña.valoracion)
        const texto = createElement("p", "textoReseña", reseña.reseña)
        const fecha = crearFechaFormateada(reseña.fecha)
        const eliminarBtn = crearBotonEliminar(reseña)
        
        reseñaCard.append(restaurante, categoria, estrellas, texto, fecha, eliminarBtn)
        return reseñaCard
    }
    
    function crearFechaFormateada(timestamp) {
        const fechaObj = new Date(timestamp)
        const fechaFormateada = `${fechaObj.getDate().toString().padStart(2, "0")}/` +
            `${(fechaObj.getMonth() + 1).toString().padStart(2, "0")}/` +
            `${fechaObj.getFullYear()}`
        return createElement("p", "fecha", fechaFormateada)
    }
    
    function crearBotonEliminar(reseña) {
        const eliminarBtn = createElement("button", "eliminarBtn", "🗑️ Eliminar")
        
        eliminarBtn.addEventListener("click", () => {
            if (confirm(`¿Estás seguro de eliminar la reseña de "${reseña.restaurante}"?`)) {
                localStorageManager().eliminar(reseña.id)
                location.reload()
            }
        })
        
        return eliminarBtn
    }
    
    function cargarCategorias() {
        const filtrosCategorias = mainContainer.querySelector(".filtrosCategorias")
        const categorias = new Set(reseñas.map(r => r.categoria))
        
        categorias.forEach(categoria => {
            const label = document.createElement("label")
            const checkbox = document.createElement("input")
            checkbox.type = "checkbox"
            checkbox.value = categoria
            label.append(checkbox, " " + categoria)
            filtrosCategorias.append(label)
        })
    }
    
    // ==================== FORMULARIO ====================
    function cargarFormulario() {
        mainContainer.innerHTML = ""
        
        const form = createElement("form","addForm")
        const cancelar = crearBotonCancelar()
        const title = createElement("h2","titleForm","Añadir una review")
        
        const { labelRestaurante, inputRestaurante } = crearCampoRestaurante()
        const { labelCategoria, inputCategoria } = crearCampoCategoria()
        const { labelValoracion, selectValoracion } = crearCampoValoracion()
        const { labelReseña, inputReseña } = crearCampoReseña()
        
        const enviar = crearBotonEnviar(inputRestaurante, inputCategoria, selectValoracion, inputReseña)
        
        form.append(
            title, 
            labelRestaurante, inputRestaurante, 
            labelCategoria, inputCategoria, 
            labelValoracion, selectValoracion, 
            labelReseña, inputReseña, 
            enviar
        )
        
        mainContainer.append(form, cancelar)
    }
    
    function crearBotonCancelar() {
        const cancelar = createElement("button","cancelar","X")
        cancelar.addEventListener("click", () => {
            cargarMain()
        })
        return cancelar
    }
    
    function crearCampoRestaurante() {
        const labelRestaurante = createElement("label","labelTextoTitulo","El restaurante")
        const inputRestaurante = createElement("input","inputTextoTitulo")
        inputRestaurante.type = "text"
        inputRestaurante.placeholder = "Nombre del restaurante"
        return { labelRestaurante, inputRestaurante }
    }
    
    function crearCampoCategoria() {
        const labelCategoria = createElement("label","labelTextoCategoria","Categoria")
        const inputCategoria = createElement("input","inputTextoCategoria")
        inputCategoria.type = "text"
        inputCategoria.placeholder = "Tipo de restaurante"
        return { labelCategoria, inputCategoria }
    }
    
    function crearCampoValoracion() {
        const labelValoracion = createElement("label","labelValoracion","Puntuacion:")
        const selectValoracion = createElement("select","selectValoracion")
        
        const opciones = ["1", "2", "3", "4", "5"]
        opciones.forEach((valoracion) => {
            const option = document.createElement("option")
            option.textContent = valoracion
            option.value = valoracion
            selectValoracion.append(option)
        })
        
        return { labelValoracion, selectValoracion }
    }
    
    function crearCampoReseña() {
        const labelReseña = createElement("label","labelTexto","Tu reseña:")
        const inputReseña = createElement("textarea","inputTexto")
        inputReseña.placeholder = "Escribe tu reseña Aqui"
        return { labelReseña, inputReseña }
    }
    
    function crearBotonEnviar(inputRestaurante, inputCategoria, selectValoracion, inputReseña) {
        const enviar = createElement("button","enviar","Añadir Reseña")
        
        enviar.addEventListener("click", (e) => {
            e.preventDefault()
            
            if (!inputRestaurante.value || !inputCategoria.value || !inputReseña.value) {
                alert("Necesitar rellenar todos los campos")
                return
            }
            
            const restaurante = capitalizarTexto(inputRestaurante.value)
            const categoria = capitalizarTexto(inputCategoria.value)
            
            const reseña = {
                id: Date.now(),
                restaurante,
                categoria,
                reseña: inputReseña.value.trim(),
                valoracion: selectValoracion.value,
                fecha: Date.now()
            }
            
            localStorageManager().guardar(reseña)
            cargarMain()
        })
        
        return enviar
    }
    
    function capitalizarTexto(texto) {
        return texto
            .trim()
            .toLowerCase()
            .split(" ")
            .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
            .join(" ")
    }
    
    // ==================== FOOTER ====================
    function crearFooter() {
        const footer = createElement("footer","footer")
        const totalReseñas = createElement("p","totalReseñas", `Reseñas: ${reseñas.length}`)
        const promedio = reseñas.reduce((acc, r) => acc + Number(r.valoracion), 0) / reseñas.length
        const promedioReseñas = createElement("p","promedioReseñas",`promedio de ★ ${promedio.toFixed(1)}`)
        const mejor = obtenerMejorRestaurante(reseñas)
        const mejorRestaurante = createElement("p", "mejorRestaurante", `Mejor restaurante ${mejor}`)
        
        footer.append(totalReseñas, promedioReseñas, mejorRestaurante)
        return footer
    }
    
    // ==================== UTILIDADES ====================
    function obtenerFiltrosActivos() {
        const categoriasSeleccionadas = Array.from(
            mainContainer.querySelectorAll(".filtrosCategorias input:checked")
        ).map(checkbox => checkbox.value)
        
        return {
            calificacion: calificacionSeleccionada,
            categorias: categoriasSeleccionadas
        }
    }
    
    function aplicarFiltros() {
        const filtros = obtenerFiltrosActivos()
        const ordenActual = mainContainer.querySelector(".reseñasSelect").value
        cargarReseñas(ordenActual, filtros)
    }
    
    // ==================== CARGA PRINCIPAL ====================
    function cargarMain() {
        mainContainer.innerHTML = ""
        
        const sidebar = crearSidebar()
        const seccionReseñas = crearSeccionReseñas()
        
        mainContainer.append(sidebar, seccionReseñas)
        
        cargarReseñas()
        cargarCategorias()
        configurarEventosEstrellas()
    }
    
    // ==================== INICIALIZACIÓN ====================
    const header = crearHeader()
    cargarMain()
    const footer = crearFooter()
    
    container.append(header, mainContainer, footer)
    
    return {
        element: container
    }
}

export default App