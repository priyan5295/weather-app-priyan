import React from 'react'
import searchIcon from '../assets/search-icon.png'
import clearSun from '../assets/clear-sun.png'
import cloudIcon from '../assets/clouds.png'
import drizzleIcon from '../assets/drizzle.png'
import rainIcon from '../assets/rain.png'
import windIcon from '../assets/wind.png'
import snowIcon from '../assets/snow.png'
import humidityIcon from '../assets/humidity.png'
import { useEffect, useState } from 'react'
// import PropTypes from "prop-types"

const WeatherDetails = ({ icon, temp, city, country, lat, long, humidity, wind }) => {
  return (
    <>
    <div className='flex items-center justify-center mt-2'>
      <img src={icon} alt='Image' className='w-48' />
    </div>
    <div className='mt-3 text-2xl text-center uppercase'>
    <div className="font-extrabold ">
        {temp}&#176;C
    </div>
    <div className="text-amber-500 font-medium">{city}</div>
    <div className="font-bold text-base">{country}</div>
    </div>
    <div className="flex items-center justify-center gap-3">
        <div className='flex flex-col items-center justify-center'>
          <span className='lat'>Latitude</span>
          <span>{lat}</span>
        </div>
        <div className='flex flex-col items-center justify-center'>
          <span className='long'>Longitude</span>
          <span>{long}</span>
        </div>
    </div>
    <div className='flex justify-between mt-3'>
      <div className='text-center'>
        <img src={humidityIcon} alt='humdity' className='humidty w-11' />
        <div className='data'>
          <div>{humidity}%</div>
          <div>Humdity</div>
        </div>
      </div>
      <div className='text-center'> 
        <img src={windIcon} alt='wind' className='wind w-11' />
        <div className='data'>
          <div>{wind} km/h</div>
          <div>Wind speed</div>
        </div>
      </div>
    </div>
    </>
  )
}

// WeatherDetails.propTypes = {
//     icons: PropTypes.string.isRequired,
//     temps: PropTypes.number.isRequired,
//     cities: PropTypes.string.isRequired,
//     countries: PropTypes.string.isRequired,
//     humidity: PropTypes.number.isRequired,
//     winds: PropTypes.number.isRequired,
//     lati: PropTypes.number.isRequired,
//     long: PropTypes.number.isRequired,
// }

function App() {
  let Api_key = '925bda937a59d0d72909b5165d45a0e4'
  const[text, setText] = useState("Erode")

  const [icons, setIcons] = useState(snowIcon)
  const [temps, setTemps] = useState(0)
  const [cities, setCities] = useState("Erode")
  const [countries, setCountries] = useState("IN")
  const [lati, setLati] = useState(0)
  const [longi, setLongi] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [winds, setWinds] = useState(0)
  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const weatherIconMap = {
    "01d": clearSun,
    "01n": clearSun,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n" : drizzleIcon,
    "04d": drizzleIcon,
    "04n" : drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  }

  const api_search = async () => {
    setLoading(true)

    setErrorMsg('');
    
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(text)}&appid=${Api_key}&units=Metric`;

    try {
      let response = await fetch(url);
      let data = await response.json()
      // console.log('output data', data);
      if(data.cod === '404') {
        console.error('city not found')
        setCityNotFound(true)
        setLoading(false)
        return
      }

      setHumidity(data.main.humidity)
      setWinds(data.wind.speed)
      setTemps(Math.floor(data.main.temp))
      setCities(data.name)
      setCountries(data.sys.country)
      setLati(data.coord.lat)
      setLongi(data.coord.lon)

      const weatherIconCode = data.weather[0].icon
      setIcons(weatherIconMap[weatherIconCode] || clearSun)
      setCityNotFound(false)


    } catch(err){
          console.log('an error roccured', err.message)
          setErrorMsg("An Error Occured while fetching weather data.")
    } finally {
      setLoading(false)
    }
  }

  const handleCityChange = (event) => {
    setErrorMsg('');
    
    setText(event.target.value)
  }
  const handleKeyDown = (e) => {
    

    if(e.key === 'Enter') {
      if(!text.trim()){
        setErrorMsg("Please Enter a Correct & Valid City Name")
        return;
      }
      api_search();
      
    }
  }
  
  useEffect(() => {
    api_search()
  },[]) // once call after they never call 


  return (
    <>
     <div className='bg-slate-700 bg-cover'>
     <div className='container mx-auto flex justify-center items-center h-screen'>
       
      <div className='bg-white shadow-md rounded px-8 mt-5 pb-8 mb-4'>
            <h1 className="text-2xl mb-4 text-center">Weather App using Tailwind css</h1>
            <div className='flex items-center justify-between'>
            <input className="shadow appearance-none border rounded w-full py-2 px-3 
            text-gray-700 
            overflow-hidden
            leading-tight focus:outline-none focus:shadow-outline cityInput" 
            id="username" 
            onChange={handleCityChange}
            value={text}
            onKeyDown={handleKeyDown}
            type="text" 
            placeholder="Search City" />
            <div onClick={() => api_search()} className='cursor-pointer'>
            <img src={searchIcon} className='w-9 ml-5 ' alt='search'/>
            </div>
            
            </div>
          

            <div className='mt-5 text-gray-800 text-2xl font-light text-center'>
            {loading && <div>Loading...</div>}
            {errorMsg && <div>{errorMsg}</div>}
            {cityNotFound && <div>City not found</div>}
            </div>
            
            {!loading && !cityNotFound && <WeatherDetails icon={icons} temp={temps} city={cities}  country={countries} lat={lati} long={longi} 
              humidity={humidity} wind={winds}
            />}

            <p className='mt-3 text-center text-base text-stone-400'>
              Designed by <span className='text-blue-700 underline'>Sathiya Priyan</span>
              </p>
      </div>
      
     </div>
     </div>
    </>
  )
}

export default App
