import axios from 'axios'
import { getExpiry } from './jwt'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8081/api',
  headers: { 'Content-Type': 'application/json' }
})

// helper to get stored user
function getStoredUser(){
  try{
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  }catch(e){ return null }
}


api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  console.log('Sending token:', user?.token)
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});
/*
// request interceptor: attach token and attempt refresh if token is near expiry (<60s)
api.interceptors.request.use(async config => {
  try {
    const user = getStoredUser()
    if(user && user.token){
      const expMs = getExpiry(user.token)
      const now = Date.now()
      const timeLeft = expMs ? (expMs - now) : null

      // If token expires in less than 60 seconds, attempt refresh synchronously
      if(timeLeft !== null && timeLeft < 60000){
        try{
          // remove extra /api
          const resp = await axios.post(`${import.meta.env.VITE_API_BASE || 'http://localhost:8081'}/auth/refresh`, { refreshToken: user.refreshToken })
          const data = resp.data
          // update stored user
          const newUser = { ...user, token: data.token, refreshToken: data.refreshToken || user.refreshToken }
          localStorage.setItem('user', JSON.stringify(newUser))
          config.headers.Authorization = `Bearer ${data.token}`
        }catch(e){
          // refresh failed — clear storage and let request continue (it will likely 401)
          localStorage.removeItem('user')
          return config
        }
      } else {
        config.headers.Authorization = `Bearer ${user.token}`
      }
    }
  } catch(e){}
  return config
})
*/

// response interceptor: if 401, try one-time refresh then retry request; otherwise logout on failure
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if(err.response && err.response.status === 401 && !original._retry){
      original._retry = true
      const user = getStoredUser()
      if(user && user.refreshToken){
        try{
          const resp = await axios.post(`${api.defaults.baseURL}/api/auth/refresh`, { refreshToken: user.refreshToken })
          const data = resp.data
          const newUser = { ...user, token: data.token, refreshToken: data.refreshToken || user.refreshToken }
          localStorage.setItem('user', JSON.stringify(newUser))
          original.headers['Authorization'] = `Bearer ${data.token}`
          return api(original)
        }catch(e){
          // refresh failed - fallthrough to logout
          localStorage.removeItem('user')
          window.location.href = '/login'
          return Promise.reject(e)
        }
      } else {
        // no refresh token -> logout
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(err)
  }
)

export default api
