const calcularImagen = (data) => {
    const weather = data.weather[0];
    const main = weather.main;
    const id = weather.id;
    const temp = data.main.temp; // en °C
    const wind = data.wind.speed; // en m/s
    const dt = data.dt;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;

    // Día o noche
    const esDia = dt >= sunrise && dt <= sunset;

    // Temperaturas extremas
    if (temp > 30) return "ExtremaCalor.png";
    if (temp < 0) return "ExtremaFrío.png";

    // Viento fuerte
    if (wind > 8) return "Ventoso.png";

    switch(main){
        case "Clear":
            return esDia ? "SoleadoDespejado.png" : "NocheClara.png";
        case "Clouds":
            if (id === 801 || id === 802) return "ParcialmenteNublado.png";
            return "Nublado.png"; // broken o overcast
        case "Rain":
        case "Drizzle":
            if (id < 501) return "LluviaLigera.png";
            return "Chubascos.png";
        case "Thunderstorm":
            return "Tormenta.png";
        case "Snow":
            if (id < 622) return "NieveLigera.png";
            return "NevadaIntensa.png";
        case "Mist":
        case "Fog":
        case "Haze":
            return "Niebla.png";
        case "Dust":
        case "Sand":
        case "Ash":
            return "Polvo.png";
        default:
            return "SoleadoDespejado.png";
    }
}

export default calcularImagen;
