import React, { useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function AdminTokens(){
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  useEffect(()=>{ load() }, [])

  const load = async () => {
    setLoading(true)
    try{
      const res = await api.get('/api/admin/refresh-tokens')
      setTokens(res.data)
    }catch(e){
      console.error(e)
    }finally{ setLoading(false) }
  }

  const revoke = async (id) => {
    try{
      await api.post(`/api/admin/refresh-tokens/${id}/revoke`)
      load()
    }catch(e){ console.error(e) }
  }

  if(!user) return <div>Please login as admin</div>
  if(!user.roles || !user.roles.includes('ROLE_ADMIN')) return <div>Access denied</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Refresh Tokens (Admin)</h2>
      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {tokens.map(t => (
            <div key={t.id} className="bg-white p-3 rounded shadow">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{t.user ? t.user.username : '—'}</div>
                  <div className="text-sm text-gray-500">{t.ipAddress} · {t.userAgent}</div>
                </div>
                <div>
                  <div className="text-sm">Expires: {t.expiryDate ? new Date(t.expiryDate).toLocaleString() : '—'}</div>
                  <div className="mt-2"><button onClick={()=>revoke(t.id)} className="px-2 py-1 bg-red-600 text-white rounded">Revoke</button></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
