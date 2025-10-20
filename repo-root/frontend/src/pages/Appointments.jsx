import React, { useEffect, useState } from 'react'
import api from '../lib/api'

function toLocalDatetimeString(dt){
  if(!dt) return ''
  const d = new Date(dt)
  // yyyy-MM-ddTHH:mm
  const pad = (n)=>n.toString().padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function Appointments(){
  const [appointments, setAppointments] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startAt, setStartAt] = useState('')
  const [endAt, setEndAt] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/appointments')
      setAppointments(res.data)
    } catch (e){
      console.error(e)
    } finally { setLoading(false) }
  }

  useEffect(()=>{ load() }, [])

  const resetForm = () => {
    setTitle(''); setDescription(''); setStartAt(''); setEndAt(''); setEditingId(null); setError(null)
  }

  const validate = () => {
    if(!title || title.trim().length < 2) { setError('Title is required (min 2 chars)'); return false }
    if(startAt && endAt){
      const s = new Date(startAt); const e = new Date(endAt)
      if(s >= e){ setError('End time must be after start time'); return false }
    }
    return true
  }

  const createOrUpdate = async () => {
    setError(null)
    if(!validate()) return
    const payload = { title, description, startAt: startAt || null, endAt: endAt || null }
    try {
      if(editingId){
        const res = await api.put(`/appointments/${editingId}`, payload)
        setAppointments(prev => prev.map(a => a.id === editingId ? res.data : a))
      } else {
        const res = await api.post('/appointments', payload)
        setAppointments(prev => [res.data, ...prev])
      }
      resetForm()
    } catch(e){
      console.error(e)
      setError('Failed to save appointment')
    }
  }

  const edit = (a) => {
    setEditingId(a.id)
    setTitle(a.title || '')
    setDescription(a.description || '')
    setStartAt(toLocalDatetimeString(a.startAt))
    setEndAt(toLocalDatetimeString(a.endAt))
  }

  const remove = async (id) => {
    if(!confirm('Delete appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`)
      setAppointments(prev => prev.filter(a=>a.id!==id))
    } catch(e){ console.error(e) }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Appointments</h2>
      <div className="mb-4 bg-white p-4 rounded shadow">
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded mb-2" />
        <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded mb-2" />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input type="datetime-local" value={startAt} onChange={e=>setStartAt(e.target.value)} className="p-2 border rounded" />
          <input type="datetime-local" value={endAt} onChange={e=>setEndAt(e.target.value)} className="p-2 border rounded" />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex space-x-2">
          <button onClick={createOrUpdate} className="px-4 py-2 bg-blue-600 text-white rounded">{editingId ? 'Update' : 'Create'}</button>
          <button onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded">Reset</button>
        </div>
      </div>

      {loading ? <div>Loading...</div> : (
        <div className="space-y-3">
          {appointments.map(a=> (
            <div key={a.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">{a.title || 'Untitled'}</h3>
                <div className="text-sm text-gray-500">{a.startAt ? new Date(a.startAt).toLocaleString() : ''}</div>
              </div>
              <p className="text-sm mt-2">{a.description}</p>
              <div className="mt-2 flex space-x-2">
                <button onClick={()=>edit(a)} className="text-blue-600 text-sm">Edit</button>
                <button onClick={()=>remove(a.id)} className="text-red-600 text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
