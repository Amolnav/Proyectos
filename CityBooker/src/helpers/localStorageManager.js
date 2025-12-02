function localStorageManager() {
    return {
        // Cargar datos desde localStorage por key (como array)
        cargar: (key) => {
            try {
                return JSON.parse(localStorage.getItem(key) || "[]")
            } catch (error) {
                console.error(`Error al cargar ${key}:`, error)
                return []
            }
        },

        // NUEVO: Cargar datos como objeto directo (no array)
        cargarObjeto: (key) => {
            try {
                return JSON.parse(localStorage.getItem(key) || "null")
            } catch (error) {
                console.error(`Error al cargar objeto ${key}:`, error)
                return null
            }
        },

        // Guardar un item en un array dentro de localStorage
        guardar: (key, item) => {
            try {
                const data = localStorageManager().cargar(key)
                data.push(item)
                localStorage.setItem(key, JSON.stringify(data))
                return true
            } catch (error) {
                console.error(`Error al guardar en ${key}:`, error)
                return false
            }
        },

        // Eliminar un item de un array dentro de localStorage
        eliminar: (key, item) => {
            try {
                const data = localStorageManager().cargar(key)
                const filtrados = data.filter(i => JSON.stringify(i) !== JSON.stringify(item))
                localStorage.setItem(key, JSON.stringify(filtrados))
                return true
            } catch (error) {
                console.error(`Error al eliminar de ${key}:`, error)
                return false
            }
        },

        // Sobrescribir completamente el valor de una key
        guardarTodo: (key, data) => {
            try {
                localStorage.setItem(key, JSON.stringify(data))
                return true
            } catch (error) {
                console.error(`Error al guardar ${key}:`, error)
                return false
            }
        },

        // NUEVO: Eliminar una key completa del localStorage
        eliminarKey: (key) => {
            try {
                localStorage.removeItem(key)
                return true
            } catch (error) {
                console.error(`Error al eliminar key ${key}:`, error)
                return false
            }
        }
    }
}

export default localStorageManager