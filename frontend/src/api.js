const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || 'Request failed')
  }
  return response.json()
}

const API = {
  get: (path) => fetch(`/api${path}`).then(handleResponse),
  
  post: (path, body) => fetch(`/api${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(handleResponse),
  
  put: (path, body) => fetch(`/api${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(handleResponse),
  
  patch: (path, body) => fetch(`/api${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(handleResponse),
  
  postForm: (path, formData) => fetch(`/api${path}`, {
    method: 'POST',
    body: formData
  }).then(handleResponse)
}

export default API