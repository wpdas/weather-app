import axios from 'axios';

const api = {
  getCountries: () => {
    return axios.get(`/api/countries`);
  },
  getStateByCode: countryCode => {
    return axios.get(`/api/state?countryCode=${countryCode}`);
  },
  getWeatherByCityAndCode: (city, countryCode) => {
    return axios.get(`/api/weather?city=${city}&countryCode=${countryCode}`);
  }
};

export default api;
