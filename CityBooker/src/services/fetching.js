
function fetching() {
    return fetch("http://localhost:3500/hoteles")
    .then((res) => {
        if (!res.ok) throw new Error("Error en el fetching")
        return res.json()
    })
    .catch((err) => {
        console.error(err);
        throw err;
    })

}

export default fetching