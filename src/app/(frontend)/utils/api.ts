import axios from 'axios'

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

// Intercept responses to catch auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401 || status === 403) {
      // Remove invalid session data
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)
