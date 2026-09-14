export const PLAYERS = [
  'Mateo','Valen','Johan','Simón','Tiziano','Maxi','Gero','Facu P',
  'Toto','Neme','Lio','Salva','Pedro','Juanchi','Facu O','Goran',
  'Fran','Augusto','Bauti','Dante','Demian','Lucho','Dylan',
];

export const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

export const POSITIONS = [
  'Pilar Derecho','Pilar Izquierdo','Talonador','Lock','Flanker Abierto',
  'Flanker Ciego','Octavo','Medio Scrum','Apertura','Centro','Ala','Full',
];

export const SKILLS = [
  { key: 'velocidad', label: 'Velocidad' },
  { key: 'tackle', label: 'Tackle' },
  { key: 'pelota', label: 'Juego con pelota' },
  { key: 'kick', label: 'Patada' },
  { key: 'liderazgo', label: 'Liderazgo' },
];

export const LOCAL_KEY = 'm15_v1';
export const PROFILES_KEY = 'm15_profiles_v1';
export const MATCHES_KEY = 'm15_matches_v1';

export const SCRIPT = 'https://script.google.com/macros/s/AKfycbxLCGNJtRrNHaXWimqMKJYVuBG7eIwqFgN8nNTGqPz9LNa9Jnwh_GHmkHJXdFwIVgcI/exec';

export function ini() {
  return Object.fromEntries(PLAYERS.map(p => [p, 'none']));
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}

export function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export async function apiCall(payload) {
  const r = await fetch(SCRIPT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return r.json();
}

export const SEED_SESSIONS = [
  { fecha: '2026-02-07', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'present',Bauti:'present',Dante:'present',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-02-10', jugadores: { Mateo:'present',Valen:'present',Johan:'absent',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'absent','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'absent',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'absent',Fran:'present',Augusto:'present',Bauti:'present',Dante:'absent',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-02-14', jugadores: { Mateo:'present',Valen:'absent',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'absent',Toto:'present',Neme:'absent',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'absent','Facu O':'present',Goran:'present',Fran:'present',Augusto:'absent',Bauti:'present',Dante:'present',Demian:'present',Lucho:'absent',Dylan:'present' } },
  { fecha: '2026-02-17', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'absent',Tiziano:'absent',Maxi:'present',Gero:'present','Facu P':'present',Toto:'absent',Neme:'present',Lio:'present',Salva:'present',Pedro:'absent',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'absent',Augusto:'present',Bauti:'present',Dante:'present',Demian:'absent',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-02-21', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'absent',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'absent',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'absent',Goran:'present',Fran:'present',Augusto:'present',Bauti:'absent',Dante:'present',Demian:'present',Lucho:'present',Dylan:'absent' } },
  { fecha: '2026-02-24', jugadores: { Mateo:'absent',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'present',Bauti:'present',Dante:'present',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-02-28', jugadores: { Mateo:'present',Valen:'present',Johan:'absent',Simón:'present',Tiziano:'absent',Maxi:'present',Gero:'present','Facu P':'absent',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'absent',Juanchi:'present','Facu O':'present',Goran:'absent',Fran:'present',Augusto:'present',Bauti:'present',Dante:'present',Demian:'absent',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-03-03', jugadores: { Mateo:'present',Valen:'absent',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'absent','Facu P':'present',Toto:'absent',Neme:'present',Lio:'present',Salva:'absent',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'absent',Bauti:'present',Dante:'present',Demian:'present',Lucho:'present',Dylan:'absent' } },
  { fecha: '2026-03-07', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'present',Neme:'absent',Lio:'absent',Salva:'present',Pedro:'present',Juanchi:'absent','Facu O':'present',Goran:'present',Fran:'present',Augusto:'present',Bauti:'absent',Dante:'present',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-03-10', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'absent',Tiziano:'present',Maxi:'absent',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'absent',Juanchi:'present','Facu O':'absent',Goran:'present',Fran:'present',Augusto:'present',Bauti:'present',Dante:'absent',Demian:'present',Lucho:'absent',Dylan:'present' } },
  { fecha: '2026-03-14', jugadores: { Mateo:'present',Valen:'present',Johan:'absent',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'absent',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'absent',Fran:'absent',Augusto:'present',Bauti:'present',Dante:'present',Demian:'present',Lucho:'present',Dylan:'absent' } },
  { fecha: '2026-03-17', jugadores: { Mateo:'absent',Valen:'present',Johan:'present',Simón:'present',Tiziano:'absent',Maxi:'present',Gero:'present','Facu P':'absent',Toto:'present',Neme:'present',Lio:'present',Salva:'absent',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'absent',Bauti:'present',Dante:'present',Demian:'absent',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-03-21', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'absent','Facu P':'present',Toto:'present',Neme:'absent',Lio:'present',Salva:'present',Pedro:'absent',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'present',Bauti:'absent',Dante:'present',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-03-24', jugadores: { Mateo:'present',Valen:'absent',Johan:'present',Simón:'absent',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'absent',Salva:'present',Pedro:'present',Juanchi:'absent','Facu O':'present',Goran:'present',Fran:'absent',Augusto:'present',Bauti:'present',Dante:'present',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-03-28', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'absent',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'absent',Goran:'present',Fran:'present',Augusto:'present',Bauti:'present',Dante:'absent',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-03-31', jugadores: { Mateo:'present',Valen:'present',Johan:'absent',Simón:'present',Tiziano:'absent',Maxi:'absent',Gero:'present','Facu P':'present',Toto:'absent',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'absent',Fran:'present',Augusto:'present',Bauti:'present',Dante:'present',Demian:'absent',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-04-04', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'absent',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'absent',Bauti:'present',Dante:'present',Demian:'present',Lucho:'absent',Dylan:'present' } },
  { fecha: '2026-04-07', jugadores: { Mateo:'absent',Valen:'present',Johan:'present',Simón:'absent',Tiziano:'present',Maxi:'present',Gero:'absent','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'absent',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'present',Bauti:'absent',Dante:'present',Demian:'present',Lucho:'present',Dylan:'absent' } },
  { fecha: '2026-04-11', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'absent',Neme:'absent',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'absent',Goran:'present',Fran:'present',Augusto:'present',Bauti:'present',Dante:'absent',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-04-14', jugadores: { Mateo:'present',Valen:'absent',Johan:'present',Simón:'present',Tiziano:'absent',Maxi:'present',Gero:'present','Facu P':'absent',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'absent','Facu O':'present',Goran:'present',Fran:'absent',Augusto:'present',Bauti:'present',Dante:'present',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-04-18', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'absent',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'absent',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'absent',Fran:'present',Augusto:'present',Bauti:'present',Dante:'present',Demian:'absent',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-04-21', jugadores: { Mateo:'present',Valen:'present',Johan:'absent',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'absent',Pedro:'absent',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'absent',Bauti:'present',Dante:'present',Demian:'present',Lucho:'absent',Dylan:'present' } },
  { fecha: '2026-04-25', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'absent','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'present',Bauti:'absent',Dante:'present',Demian:'present',Lucho:'present',Dylan:'absent' } },
  { fecha: '2026-04-28', jugadores: { Mateo:'present',Valen:'absent',Johan:'present',Simón:'absent',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'absent',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'absent','Facu O':'present',Goran:'present',Fran:'present',Augusto:'present',Bauti:'present',Dante:'absent',Demian:'present',Lucho:'present',Dylan:'present' } },
  { fecha: '2026-04-30', jugadores: { Mateo:'present',Valen:'present',Johan:'present',Simón:'present',Tiziano:'present',Maxi:'present',Gero:'present','Facu P':'present',Toto:'present',Neme:'present',Lio:'present',Salva:'present',Pedro:'present',Juanchi:'present','Facu O':'present',Goran:'present',Fran:'present',Augusto:'present',Bauti:'present',Dante:'present',Demian:'present',Lucho:'present',Dylan:'present' } },
];
