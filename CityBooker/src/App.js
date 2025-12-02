import localStorageManager from "./helpers/localStorageManager";
import fetching from "./services/fetching";
import crearElemento from "./helpers/crearElemento";

// Constantes para las keys del localStorage
const STORAGE_INPUTS = import.meta.env.VITE_STORAGE_KEY || "inputs";
const STORAGE_RESERVA = import.meta.env.VITE_STORAGE_RESERVA || "reserva";

async function App() {
    const storage = localStorageManager();

    // ==================== ESTADO INICIAL ====================
    const inputs = {
        ciudad: "",
        checkIn: "",
        checkOut: "",
        huespedes: "1"
    }

    // Cargar inputs previamente guardados del localStorage
    const guardados = storage.cargarObjeto(STORAGE_INPUTS)  
    if (guardados) {
        inputs.ciudad = guardados.ciudad || ""
        inputs.checkIn = guardados.checkIn || ""
        inputs.checkOut = guardados.checkOut || ""
        inputs.huespedes = guardados.huespedes || "1"
    }

    // ==================== ELEMENTOS DEL DOM ====================
    const container = crearElemento("div", "mainContainer")
    const header = crearElemento("header", "header")
    const title = crearElemento("h1", "mainTitle", "CityBooker")
    
    // ==================== FORMULARIO DE BÚSQUEDA ====================
    const form = crearElemento("form", "form")

    // Campo Ciudad
    const fieldCiudad = crearElemento("div", "formField")
    const labelCiudad = crearElemento("label", null, "Ciudad 🏙️")
    const ciudadSelect = crearElemento("select", "ciudadSelect")

    fieldCiudad.append(labelCiudad, ciudadSelect)

    // ==================== CARGA DE DATOS (HOTELES) ====================
    let hoteles = []
    try {
        const data = await fetching()
        const ciudades = new Set(data.map((hotel) => hotel.ciudad))
        hoteles = data

        ciudades.forEach((ciudad) => {
            const option = crearElemento("option", null, ciudad)
            option.value = ciudad
            if (ciudad === inputs.ciudad) {
                option.selected = true
            }
            ciudadSelect.append(option)
        })
    } catch (error) {
        const errorTitle = crearElemento("h1", "errorTitle", "Algo inesperado falló, pruebe más tarde")
        const errorText = crearElemento("p", "errorText", error)
        
        container.append(errorTitle, errorText)
        return container
    }
    
    // Campo Check-In
    const fieldCheckIn = crearElemento("div", "formField")
    const labelCheckin = crearElemento("label", null, "Check-In 🕑")
    const inputCheckIn = crearElemento("input")
    inputCheckIn.type = "date"
    inputCheckIn.value = inputs.checkIn

    fieldCheckIn.append(labelCheckin, inputCheckIn)

    // Campo Check-Out
    const fieldCheckOut = crearElemento("div", "formField")
    const labelCheckOut = crearElemento("label", null, "Check-Out 🕜")
    const inputCheckOut = crearElemento("input")
    inputCheckOut.type = "date"
    inputCheckOut.value = inputs.checkOut

    fieldCheckOut.append(labelCheckOut, inputCheckOut)

    // Campo Huéspedes
    const fieldHuespedes = crearElemento("div", "formField")
    const labelHuespedes = crearElemento("label", null, "Huéspedes 🕴️")
    const inputHuespedes = crearElemento("input")
    inputHuespedes.type = "number"
    inputHuespedes.value = inputs.huespedes
    inputHuespedes.min = "1"

    fieldHuespedes.append(labelHuespedes, inputHuespedes)

    // Botón de búsqueda
    const fieldSubmit = crearElemento("div", "formField")
    const submit = crearElemento("button", "submit", "Buscar 🔎")

    fieldSubmit.append(submit)
    
    // Contenedor para mostrar los resultados de hoteles
    const hotelDiv = crearElemento("div", "hotelDiv")

    // ==================== LÓGICA DE BÚSQUEDA ====================
    form.addEventListener("submit", (e) => {
        e.preventDefault()
        hotelDiv.innerHTML = ""

        inputs.ciudad = ciudadSelect.value
        inputs.checkIn = inputCheckIn.value
        inputs.checkOut = inputCheckOut.value
        inputs.huespedes = inputHuespedes.value
        
        storage.guardarTodo(STORAGE_INPUTS, inputs)

        const checkInDate = new Date(inputs.checkIn)
        const checkOutDate = new Date(inputs.checkOut)
        const diffTime = checkOutDate.getTime() - checkInDate.getTime()
        const dias = Math.floor(diffTime / (1000 * 60 * 60 * 24))

        if (checkInDate > checkOutDate) {
            alert("Error: la fecha de entrada es posterior a la de salida")
            return
        }

        if (checkInDate.getTime() === checkOutDate.getTime()) {
            alert("Check-in y check-out son el mismo día")
            return
        }

        const hotelesDisponibles = hoteles.filter((hotel) => {
            const desde = new Date(hotel.disponibilidad.desde)
            const hasta = new Date(hotel.disponibilidad.hasta)
            return desde < checkInDate && hasta > checkOutDate
        })
        .filter((hotel) => hotel.ciudad === inputs.ciudad)

        if (hotelesDisponibles.length === 0) {
            const noResults = document.createElement("p")
            noResults.textContent = "No se encontraron hoteles disponibles"
            noResults.classList.add("noResults")
            hotelDiv.append(noResults)
            return
        }

        hotelesDisponibles.forEach((hotel) => {
            const hotelForm = document.createElement("form")
            hotelForm.classList.add("hotelForm")

            const name = document.createElement("h3")
            name.textContent=hotel.nombre
            name.classList.add("hotelName")

            const capacidad = document.createElement("p")
            capacidad.textContent = `Capacidad: ${hotel.personasPorHabitacion} personas`
            capacidad.classList.add("hotelCapacidad")

            const precio = document.createElement("p")
            precio.textContent = `Precio por persona: €${hotel.precioPorPersona}`
            precio.classList.add("hotelPrecio")

            const precioTotalCalculado = hotel.precioPorPersona * dias * inputs.huespedes
            const precioTotal = document.createElement("p")
            precioTotal.textContent = `Total: €${precioTotalCalculado}`
            precioTotal.classList.add("precioTotal")

            const reservar = document.createElement("button")
            reservar.textContent="Reservar ✒️"
            reservar.classList.add("hotelReserva")

            hotelForm.append(name, capacidad, precio, precioTotal, reservar)
            hotelDiv.append(hotelForm)

            hotelForm.addEventListener("submit", (e) => {
                e.preventDefault()

                const reserva = {
                    hotel: name.textContent,
                    checkInDate: inputs.checkIn,
                    checkOutDate: inputs.checkOut,
                    huespedes: inputs.huespedes,
                    precioTotal: precioTotalCalculado,
                    iva: precioTotalCalculado * 0.21
                }

                storage.guardarTodo(STORAGE_RESERVA, reserva)
                storage.eliminarKey(STORAGE_INPUTS)
                hotelDiv.innerHTML = ""
                
                const totalConIva = reserva.precioTotal + reserva.iva
                alert(
                    `✅ ¡Reserva Completada!\n\n` +
                    `🏨 Hotel: ${reserva.hotel}\n` +
                    `📅 Check-in: ${reserva.checkInDate}\n` +
                    `📅 Check-out: ${reserva.checkOutDate}\n` +
                    `👥 Huéspedes: ${reserva.huespedes}\n` +
                    `💰 Total: €${totalConIva.toFixed(2)} (IVA incluido)`
                )
                
                location.reload()
            })
        })
    })

    // ==================== CARD DE RESERVA ACTUAL ====================
    let reservaCard = null
    const reservaGuardada = storage.cargarObjeto(STORAGE_RESERVA)
    
    if (reservaGuardada) {
        reservaCard = crearElemento("div", "reservaCard")
        const reservaTitle = crearElemento("h2", "reservaTitle", "Tu Reserva Actual 🎫")
        const reservaHotel = crearElemento("h3", "reservaHotel", reservaGuardada.hotel)
        const reservaDates = crearElemento("p", "reservaDates", `📅 Del ${reservaGuardada.checkInDate} al ${reservaGuardada.checkOutDate}`)
        const reservaHuespedes = crearElemento("p", "reservaHuespedes", `👥 Huéspedes: ${reservaGuardada.huespedes}`)
        const reservaPrecio = crearElemento("p", "reservaPrecio", `💰 Precio Total: €${reservaGuardada.precioTotal.toFixed(2)}`)
        const reservaIva = crearElemento("p", "reservaIva", `IVA (21%): €${reservaGuardada.iva.toFixed(2)}`)
        
        const totalConIva = reservaGuardada.precioTotal + reservaGuardada.iva
        const reservaTotal = crearElemento("p", "reservaTotal", `Total con IVA: €${totalConIva.toFixed(2)}`)
        const cancelarBtn = crearElemento("button", "cancelarReserva", "Cancelar Reserva ❌")
        
        cancelarBtn.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que quieres cancelar tu reserva?")) {
                storage.eliminarKey(STORAGE_RESERVA)
                location.reload()
            }
        })
        
        reservaCard.append(
            reservaTitle, 
            reservaHotel, 
            reservaDates, 
            reservaHuespedes, 
            reservaPrecio, 
            reservaIva, 
            reservaTotal, 
            cancelarBtn
        )
    }

    // ==================== CONSTRUCCIÓN DEL DOM ====================
    header.append(title)
    form.append(fieldCiudad, fieldCheckIn, fieldCheckOut, fieldHuespedes, fieldSubmit)
    
    if (reservaCard) {
        container.append(header, form, hotelDiv, reservaCard)
    } else {
        container.append(header, form, hotelDiv)
    }
    
    return container
}

export default App