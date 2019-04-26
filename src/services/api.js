import axios from 'axios';

const devApiUrl = 'http://consigo.local/api';
const prodApiUrl = 'https://stage-dinheirow.herokuapp.com/api';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? prodApiUrl : devApiUrl,
});

export const storeImage = async data => {
  const response = await api.post('/pictures/1', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}
