import axios from 'axios';

const devApiUrl = 'http://development.local/api';
const prodApiUrl = 'https://production.local/api';

const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? prodApiUrl : devApiUrl,
});

export const storeImage = async data => {
  const response = await api.post('/pictures/1', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}
