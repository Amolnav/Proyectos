const apiUrl = import.meta.env.VITE_API_URL
const apiKey = import.meta.env.VITE_API_KEY

const fetching = (city) => {
    city = city.trim().toLowerCase()
    return fetch(`${apiUrl}?q=${city}&appid=${apiKey}&units=metric`)
        .then((res) => {
            if (!res.ok) throw new Error("Error en el fetch");
            return res.json(); 
        })
        .then((data) => {
            return data
        })
        .catch((err) => {
            console.error(err);
        });
};

export default fetching