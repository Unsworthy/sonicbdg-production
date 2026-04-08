import React from 'react'
import { AuthProvider } from './context/AuthContext'
import Header from './components/layout/Header'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import CountdownSection from './components/sections/CountdownSection'
import MatchSchedule from './components/sections/MatchSchedule'
import WatchParty from './components/sections/WatchParty'
import Gallery from './components/sections/Gallery'
import EventCalendar from './components/sections/EventCalendar'
import VideoHighlights from './components/sections/VideoHighlights'
import SocialMedia from './components/sections/SocialMedia'
import MemberRegistration from './components/sections/MemberRegistration'
import AdminPanel from './components/sections/AdminPanel'

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0A0A0A] text-white">
        <Header />
        <Navbar />
        <main className="container mx-auto px-4 py-12 space-y-16">
          <CountdownSection />
          <MatchSchedule />
          <WatchParty />
          <Gallery />
          <EventCalendar />
          <VideoHighlights />
          <SocialMedia />
          <MemberRegistration />
          <AdminPanel />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App