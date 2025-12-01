const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY || "weather_favorites";

function localStorageManager() {
    return {
        cargar: () => {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
            } catch (error) {
                console.error("Error al cargar favoritos:", error);
                return [];
            }
        },

        guardar: (cityName) => {
            try {
                const favs = localStorageManager().cargar();
            
                // Evitar duplicados
                if (!favs.includes(cityName)) {
                    favs.push(cityName);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
                    return true;
                }
                    return false;
            } catch (error) {
                console.error("Error al guardar favorito:", error);
                return false;
            }
        },

        eliminar: (cityName) => {
            try {
                const favs = localStorageManager().cargar();
                const filtrados = favs.filter((fav) => fav !== cityName);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
                return true;
            } catch (error) {
                console.error("Error al eliminar favorito:", error);
                return false;
            }
        },
    }
}

export default localStorageManager;