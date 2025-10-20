export function parseJwt(token){
  try{
    const parts = token.split('.')
    if(parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')))
    return payload
  }catch(e){
    return null
  }
}

// src/lib/jwt.js
export function getExpiry(token){
  if(!token) return null
  try{
    const payload = JSON.parse(atob(token.split('.')[1]))
    if(!payload.exp) return null
    return payload.exp * 1000 // convert seconds to ms
  }catch(e){ return null }
}

