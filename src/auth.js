import axios from 'axios'
import Cookies from 'js-cookie'

// Configuracion
// Public key: segura para el browser (reads + magic link auth)
const PUBLIC_KEY = import.meta.env.VITE_REQRES_PUBLIC_KEY
const BASE = 'https://reqres.in'

const api = axios.create({
  baseURL: BASE,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': PUBLIC_KEY, //formato de reqres
  },
})

export default {
  // Sesion
  setSession(data) {
    // data = { email, session_token }
    Cookies.set('session', JSON.stringify(data), { expires: 1 }) //expira en 1 dia
  },
  getSession() {
    const raw = Cookies.get('session')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  },
  getToken() {
    return this.getSession()?.session_token ?? null
  },
  isLoggedIn() {
    return !!this.getToken()
  },
  logout() {
    Cookies.remove('session')
  },

  // Como funciona Magic link: paso 1
  // Envia un token al email
  // El usuario recibira un token de 6 digitos
  requestMagicCode(email) {
    return api.post('/api/app-users/login', { email })
  },

  // Como funciona Magic link: paso 2
  // Verifica el token y obtiene el session_token (simulacion de backend)
  // Respuesta: { session_token: "..." }
  verifyMagicCode(token) {
    return api.post('/api/app-users/verify', { token })
  },

  // Como funciona Magic link: paso 3
  // Autentificacion.Requiere Bearer token — llama a /app/me
  getMe() {
    const token = this.getToken()
    return axios.get(`${BASE}/app/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
