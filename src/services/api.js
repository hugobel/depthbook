import axios from 'axios';
import config from '../utils/config';

const api = {

  getOrderBook: (book) => {
    const url = config.API_BASE + config.ORDERBOOK_PATH;
    return axios.get(url, { params: { book } });
  },

};

export default api;
