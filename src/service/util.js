export const apiURL = 'http://localhost:8080/api'

export async function get(url) {
  let res = await fetch(url, {method: 'GET', credentials: 'include'})
  if (res.status !== 200) throw res.status
  res = await res.json()
  if (!res.ok) throw res.message
  return res.data;
}

export async function post(url, data) {
  let res = await fetch(url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    credentials: 'include'
  })
  if (res.status !== 200) throw res.status
  res = await res.json()
  if (!res.ok) throw res.message
  return res.data;
}

export async function put(url, data) {
  let res = await fetch(url, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    credentials: 'include'
  })
  if (res.status !== 200) throw res.status
  res = await res.json()
  if (!res.ok) throw res.message
  return res.data;
}

export async function del(url, data) {
  let res = await fetch(url, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data),
    credentials: 'include'
  })
  if (res.status !== 200) throw res.status
  res = await res.json()
  if (!res.ok) throw res.message
  return res.data;
}
