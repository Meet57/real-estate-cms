import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Payload backend URL
  headers: {
    'Content-Type': 'application/json',
  },
})

// Set JWT token for authenticated requests
export const setToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}