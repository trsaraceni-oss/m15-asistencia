import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://oiyjkepopabdltosnrpd.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9peWprZXBvcGFiZGx0b3NucnBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0OTA2NTAsImV4cCI6MjEwNTA2NjY1MH0.aF9FCf6qgmpRtf43H4XbvzTPsQvBOUqOmkTbsOsayWc'
)

// ── Sessions ──────────────────────────────────────────────────────────────────

export async function fetchSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('fecha, jugadores')
    .order('fecha', { ascending: false })
  if (error) throw error
  return data.map(r => ({ fecha: r.fecha, jugadores: r.jugadores }))
}

export async function upsertSession(session) {
  const { error } = await supabase
    .from('sessions')
    .upsert({ fecha: session.fecha, jugadores: session.jugadores })
  if (error) throw error
}

export async function upsertSessions(sessions) {
  const rows = sessions.map(s => ({ fecha: s.fecha, jugadores: s.jugadores }))
  const { error } = await supabase.from('sessions').upsert(rows)
  if (error) throw error
}

export async function deleteSession(fecha) {
  const { error } = await supabase.from('sessions').delete().eq('fecha', fecha)
  if (error) throw error
}

// ── Profiles ──────────────────────────────────────────────────────────────────

export async function fetchProfiles() {
  const { data, error } = await supabase.from('profiles').select('player, data')
  if (error) throw error
  return Object.fromEntries(data.map(r => [r.player, r.data]))
}

export async function upsertProfiles(profiles) {
  const rows = Object.entries(profiles).map(([player, data]) => ({ player, data }))
  if (!rows.length) return
  const { error } = await supabase.from('profiles').upsert(rows)
  if (error) throw error
}

// ── Matches ───────────────────────────────────────────────────────────────────

export async function fetchMatches() {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .order('fecha', { ascending: false })
  if (error) throw error
  return data.map(r => ({
    id: r.id,
    fecha: r.fecha,
    rival: r.rival,
    lugar: r.lugar,
    puntosNos: r.puntos_nos,
    puntosThem: r.puntos_them,
    formation: r.formation,
    jugadores: r.jugadores,
    notas: r.notas,
  }))
}

export async function upsertMatch(match) {
  const { error } = await supabase.from('matches').upsert({
    id: match.id,
    fecha: match.fecha,
    rival: match.rival,
    lugar: match.lugar,
    puntos_nos: match.puntosNos ?? '',
    puntos_them: match.puntosThem ?? '',
    formation: match.formation ?? {},
    jugadores: match.jugadores ?? [],
    notas: match.notas ?? '',
  })
  if (error) throw error
}

export async function deleteMatch(id) {
  const { error } = await supabase.from('matches').delete().eq('id', id)
  if (error) throw error
}
