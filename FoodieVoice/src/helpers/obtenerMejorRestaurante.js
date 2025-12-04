// Función para obtener el mejor restaurante
function obtenerMejorRestaurante(reseñas) {
    if (reseñas.length === 0) return "Ninguno";

    // Agrupar reseñas por restaurante
    const restaurantes = {};

    reseñas.forEach(r => {
        if (!restaurantes[r.restaurante]) {
            restaurantes[r.restaurante] = { total: 0, count: 0 };
        }
        restaurantes[r.restaurante].total += Number(r.valoracion);
        restaurantes[r.restaurante].count += 1;
    });

    // Calcular promedio de cada restaurante
    let mejor = "";
    let mejorPromedio = 0;

    Object.keys(restaurantes).forEach(nombre => {
        const { total, count } = restaurantes[nombre];
        const promedio = total / count;
        if (promedio > mejorPromedio) {
            mejorPromedio = promedio;
            mejor = nombre;
        }
    });

    return mejor;
}


export default obtenerMejorRestaurante