const ONIC_RELATED_TEAMS = ['onic', 'sonic']

export async function fetchMPLSchedule() {
  const res = await fetch('/mpl-api/en/schedule')
  if (!res.ok) throw new Error(`MPL fetch error: ${res.status}`)
  const html = await res.text()
  return parseScheduleFromHTML(html)
}

function parseScheduleFromHTML(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const matches = []
  let idx = 0
  let currentDate = null

  const allMatchEls = doc.querySelectorAll('.match')

  allMatchEls.forEach((el) => {
    if (el.classList.contains('date')) {
      const parsed = new Date(el.textContent.trim())
      if (!isNaN(parsed)) currentDate = parsed
      return
    }

    if (!el.classList.contains('py-2')) return
    if (el.classList.contains('d-flex')) return

    const teamEls = el.querySelectorAll('.team')
    if (teamEls.length < 2) return

    const team1El = teamEls[0]
    const team2El = teamEls[1]

    const team1 = team1El.querySelector('.name')?.textContent?.trim()
    const team2 = team2El.querySelector('.name')?.textContent?.trim()
    if (!team1 || !team2) return

    // ✅ Ambil logo URL
    const logo1 = team1El.querySelector('.logo img')?.getAttribute('src') || null
    const logo2 = team2El.querySelector('.logo img')?.getAttribute('src') || null

    const t1Lower = team1.toLowerCase()
    const t2Lower = team2.toLowerCase()
    const isOnicMatch = ONIC_RELATED_TEAMS.some(t => t1Lower.includes(t) || t2Lower.includes(t))
    if (!isOnicMatch) return

    const scoreEls = el.querySelectorAll(':scope > div > .score')
    let score1 = null, score2 = null, hasScore = false
    if (scoreEls.length >= 2) {
      const s1 = parseInt(scoreEls[0]?.textContent?.trim())
      const s2 = parseInt(scoreEls[1]?.textContent?.trim())
      if (!isNaN(s1) && !isNaN(s2)) { score1 = s1; score2 = s2; hasScore = true }
    }

    const popupTimeEl = el.querySelector('.match-vs .time')
    const popupTimeMatch = popupTimeEl?.textContent?.trim().match(/(\d{2}):(\d{2})/)
    const inlineTimeEl = el.querySelector('.time .pt-1')
    const inlineTimeMatch = inlineTimeEl?.textContent?.trim().match(/(\d{2}):(\d{2})/)
    const timeMatch = popupTimeMatch || inlineTimeMatch
    const hours = timeMatch ? parseInt(timeMatch[1]) : null
    const minutes = timeMatch ? parseInt(timeMatch[2]) : null

    let dateObj = null
    if (currentDate && hours !== null) {
      dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), hours, minutes, 0)
    } else if (currentDate) {
      dateObj = new Date(currentDate)
    }

    const hasReplay = !!el.querySelector('.button-watch.replay')
    const now = new Date()
    const isPast = dateObj && dateObj < now
    const isFinished = hasScore || hasReplay || isPast

    let onicWon = null
    if (hasScore) {
      const onicIsTeam1 = ONIC_RELATED_TEAMS.some(t => t1Lower.includes(t))
      onicWon = onicIsTeam1 ? score1 > score2 : score2 > score1
    }

    const timeDisplay = dateObj
      ? dateObj.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) + ' WIB'
      : (timeMatch ? `${timeMatch[0]} WIB` : 'TBD')

    matches.push({
      id: ++idx,
      team1, team2,
      logo1, logo2,   // ✅ tambah logo
      tournament: 'MPL Indonesia Season 17',
      division: 'Mobile Legends',
      time: timeDisplay,
      dateObj,
      stream: null,
      isOnicMatch: true,
      finished: isFinished,
      score1, score2, onicWon,
    })
  })

  if (matches.length === 0) throw new Error('Tidak ada match ONIC ditemukan')

  const now = new Date()
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(now.getDate() - 7)

  return matches
    .filter((m) => {
      if (m.finished) return !m.dateObj || m.dateObj >= sevenDaysAgo
      return !m.dateObj || m.dateObj >= now
    })
    .sort((a, b) => {
      if (a.finished && !b.finished) return -1
      if (!a.finished && b.finished) return 1
      if (!a.dateObj) return 1
      if (!b.dateObj) return -1
      if (a.finished && b.finished) return b.dateObj - a.dateObj
      return a.dateObj - b.dateObj
    })
    .slice(0, 15)
}