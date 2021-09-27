const fetch = require("node-fetch");

const {WEATHER_API_KEY} = process.env;

exports.handler= async (event, context) => {
   const params = Json.parse(event.body);
   const {lat, lon, units}  = params;
   const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&
                units=${units}&appid=${WEATHER_API_KEY}`;

    try{
        const weatherStream = await fetch(url);
        const weatherJson = await weatherStream.json();
        return {
            statuscode: 200,
            body : JSON.stringify(weatherJson)
        };
    } catch (err) {
        return {statuscode : 422, body: err.stack};    
    }           
}