const STORAGE_KEY = "Reseñas"

function localStorageManager() {
    return {
        cargar:() => {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
        },
        guardar:(reseña) => {
            const reseñas = localStorageManager().cargar()
            reseñas.push(reseña)
            localStorage.setItem(STORAGE_KEY,JSON.stringify(reseñas))
        },
        eliminar:(id) => {
            const reseñas = localStorageManager().cargar()
            const reseñasFiltradas = reseñas.filter(reseña => reseña.id !== id)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reseñasFiltradas))
        }
    }
}

export default localStorageManager