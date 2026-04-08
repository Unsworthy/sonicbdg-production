// ============================================================
// Data dummy untuk Sonic Bandung
// Ganti dengan API call atau data real di masa depan
// ============================================================

export const matchesData = [
  {
    id: 1,
    team1: 'ONIC',
    team2: 'Alter Ego',
    tournament: 'MPL ID S17 - Week 1',
    time: '28 Maret 17:00 WIB',
    dateObj: new Date('2026-03-28T17:00:00+07:00'),
    finished: true,       // ✅ sudah selesai kemarin
    score1: 2,         // update manual kalau tau skornya
    score2: 0,
    onicWon: true,        // update: true kalau ONIC menang, false kalau kalah
  },
  {
    id: 2,
    team1: 'ONIC',
    team2: 'RRQ',
    tournament: 'MPL ID S17 - Week 1',
    time: '29 Maret 20:00 WIB',
    dateObj: new Date('2026-03-29T20:00:00+07:00'),
    finished: false,
  },
  {
    id: 3,
    team1: 'ONIC',
    team2: 'Geek Fam',
    tournament: 'MPL ID S17 - Week 2',
    time: '3 April 15:00 WIB',
    dateObj: new Date('2026-04-03T15:00:00+07:00'),
    finished: false,
  },
  {
    id: 4,
    team1: 'ONIC',
    team2: 'Dewa United',
    tournament: 'MPL ID S17 - Week 3',
    time: '10 April 15:00 WIB',
    dateObj: new Date('2026-04-10T15:00:00+07:00'),
    finished: false,
  },
  {
    id: 5,
    team1: 'ONIC',
    team2: 'Bigetron Alpha',
    tournament: 'MPL ID S17 - Week 3',
    time: '11 April 17:00 WIB',
    dateObj: new Date('2026-04-11T17:00:00+07:00'),
    finished: false,
  }
]


export const watchPartiesData = [
  {
    id: 1,
    title: 'Royal Derby MPL ID S17',
    location: 'Campus Cafe Games',
    date: '2026-03-29',
    time: '19:00',
  },

]

export const eventsData = [
  {
    id: 1,
    day: 29,
    month: 'Mar',
    title: 'Watch Party MPL Playoffs',
    desc: 'Nonton bareng playoff MPL ID di Timezone 23 Paskal',
  },
  {
    id: 2,
    day: 31,
    month: 'Mar',
    title: 'Grand Final Watch Party',
    desc: 'Nobar Grand Final MPL ID S15 di Warunk Upnormal Dago',
  },
  {
    id: 3,
    day: 5,
    month: 'Apr',
    title: 'Gathering Sonic Bandung',
    desc: 'Kumpul bareng komunitas + main game bareng',
  },
]

export const videosData = [
  {
    id: 1,
    title: 'Kairi Savage! 10 Kill Fanny',
    subtitle: 'MPL ID S14 Grand Final',
  },
  {
    id: 2,
    title: 'Onic Juara MPL ID S14!',
    subtitle: 'Winning Moment',
  },
  {
    id: 3,
    title: 'Behind The Scene Sonic Bandung',
    subtitle: 'Gathering Komunitas',
  },
]

export const galleryEmojis = ['🏆', '🎉', '📸', '🎮', '🔥', '⚡', '🎯', '👑']

export const socialMediaLinks = [
  { label: 'Instagram', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Discord', href: '#' },
  { label: 'TikTok', href: '#' },
]

export const bandungAreas = [
  { value: 'bandung-utara', label: 'Bandung Utara' },
  { value: 'bandung-selatan', label: 'Bandung Selatan' },
  { value: 'bandung-barat', label: 'Bandung Barat' },
  { value: 'bandung-timur', label: 'Bandung Timur' },
  { value: 'cimahi', label: 'Cimahi' },
]

export const navLinks = [
  { label: 'JADWAL', href: '#jadwal' },
  { label: 'WATCH PARTY', href: '#watch-party' },
  { label: 'GALERI', href: '#galeri' },
  { label: 'KEGIATAN', href: '#kegiatan' },
  { label: 'HIGHLIGHTS', href: '#highlights' },
  { label: 'DAFTAR', href: '#daftar' },
  { label: 'ADMIN', href: '#admin' },
]

// Target countdown: Grand Final MPL ID S15
export const COUNTDOWN_TARGET = '2026-03-31T19:00:00'