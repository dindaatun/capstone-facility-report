import { API_BASE_URL } from '../config'

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem('token')

  const requestUrl = url.startsWith('http')
    ? url
    : `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`

  const headers = {
    Accept: 'application/json',
    ...options.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(requestUrl, {
    ...options,
    headers,
  })

  if (response.status === 401) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    alert('Sesi login telah berakhir. Silakan login kembali.')

    window.location.reload()
  }

  return response
}