import axios from 'axios';
import swal from 'sweetalert2';

// This is to connect to the local proxy server.
// The  local proxy server will redirect to the external shortener API.
const baseURL = 'http://127.0.0.1:9090';

// Axios Configuration
const API = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

let HTTPRequest = {};

// Shorten link
HTTPRequest.shorten = (link) => {
  return API.post(`${baseURL}/shorten/`, { 'url': link });
};

// Get Shorten Link Stats: visits, last visited date
HTTPRequest.getLinkStats = (code) => {
  return API.post(`${baseURL}/getLinkStats/`, { 'code': code });
};

export default HTTPRequest;