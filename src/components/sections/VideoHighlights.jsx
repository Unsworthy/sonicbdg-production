import { useState } from 'react'
import { Video, Play, Monitor, Radio } from 'lucide-react'

const getYouTubeId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

const VideoCard = ({ video }) => {
  const [playVideo, setPlayVideo] = useState(false)
  const videoId = getYouTubeId(video.url);
  const thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg` : null;

  return (
    <div className="group relative bg-[#0A0A0A] border border-white/10 overflow-hidden cursor-pointer transition-all duration-300 hover:border-[#FFD700]/50 block">
      <div className="relative h-48 md:h-52 overflow-hidden bg-neutral-900">

        {playVideo && videoId ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:rotate-1"
                onError={(e) => { e.target.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] to-black flex items-center justify-center">
                <Video className="w-12 h-12 text-white/10" />
              </div>
            )}

            <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-10" />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors z-10" />

            <button
              onClick={() => setPlayVideo(true)}
              className="absolute inset-0 flex items-center justify-center z-20 w-full"
            >
              <div className="w-16 h-16 bg-[#FFD700] flex items-center justify-center skew-x-[-15deg] transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_30px_rgba(255,215,0,0.5)]">
                <Play className="w-8 h-8 text-black fill-black skew-x-[15deg]" />
              </div>
            </button>

            <div className="absolute bottom-3 right-3 bg-black/90 px-2 py-1 font-mono text-[9px] text-white border border-white/10 z-30">
              {video.duration}
            </div>
            <div className="absolute top-4 left-4 w-3 h-3 border-t border-l border-[#FFD700]/50 group-hover:border-[#FFD700] transition-colors z-30" />
            <div className="absolute bottom-4 right-4 w-3 h-3 border-b border-r border-[#FFD700]/50 group-hover:border-[#FFD700] transition-colors z-30" />
          </>
        )}
      </div>

      <div className="p-5 border-t border-white/5 relative bg-[#0A0A0A] z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
          <span className="font-mono text-[9px] text-white/30 tracking-widest uppercase">Playback_Ready</span>
        </div>
        <h4 className="bebas text-2xl text-white italic tracking-wide group-hover:text-[#FFD700] transition-colors line-clamp-1">
          {video.title}
        </h4>
        <p className="text-[10px] font-mono text-white/40 uppercase tracking-tighter mt-1">
          {video.subtitle}
        </p>
      </div>
    </div>
  )
}

const VideoHighlights = () => {
  const onicVideos = [
    {
      id: 1,
      title: "NGOBROLIN TAKJIL: KAIRI & KELRA",
      subtitle: "ONIC UPDATE // RAMADAN SPECIAL",
      duration: "03:03",
      url: "https://youtu.be/Ye5a_AqjXms?si=zbwHkUGFBWRC_X6w"
    },
    {
      id: 2,
      title: "IT'S A TOUGH JOURNEY: M7 BACKSTAGE",
      subtitle: "BEHIND THE SCENE // M7 SERIES",
      duration: "21:19",
      url: "https://youtu.be/VVpeyy-_Tyk?si=vu7joqtZ_Omnzvqr"
    },
    {
      id: 3,
      title: "THE ROSTER S17: HERE WE GO!",
      subtitle: "OFFICIAL REVEAL // MPL ID S17",
      duration: "05:17",
      url: "https://youtu.be/mPLwa_Etw14?si=DKHWXx7NZG7J5J6z"
    }
  ]

  return (
    <section id="highlights" className="relative py-24 bg-[#050505] overflow-hidden border-b border-white/5">
      <div className="relative max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Video className="w-12 h-12 text-[#FFD700]" />
              <div className="absolute inset-0 bg-[#FFD700]/20 blur-xl animate-pulse" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#FFD700] tracking-[0.5em] uppercase mb-1">Broadcast_Archive // REPLAY</p>
              <h2 className="bebas text-5xl md:text-7xl text-white italic tracking-tighter">
                VIDEO <span className="text-[#FFD700]">HIGHLIGHTS</span>
              </h2>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end font-mono text-[10px] text-white/20">
            <div className="flex items-center gap-2">
              <Monitor className="w-3 h-3" />
              <span>RESOLUTION: 4K_UHD</span>
            </div>
            <span>STATION: SONIC_TV_BNDG</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          {onicVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        <div className="mt-12 flex items-center gap-4 bg-white/5 py-3 px-6 skew-x-[-10deg] border-l-4 border-red-600 relative z-10">
          <Radio className="w-4 h-4 text-red-600 animate-pulse skew-x-[10deg]" />
          <div className="overflow-hidden whitespace-nowrap">
            <p className="inline-block font-mono text-[10px] text-white/60 tracking-widest uppercase skew-x-[10deg] animate-marquee">
              LATEST UPLOAD: {onicVideos[2].title} ... DON'T FORGET TO LIKE, COMMENT, AND SUBSCRIBE TO ONIC ESPORTS OFFICIAL YOUTUBE CHANNEL ...
              JOIN THE SONIC COMMUNITY NOW ... FOLLOW OUR INSTAGRAM @ONIC.ESPORTS FOR DAILY UPDATES ...
              GO SONIC! #GOONIC #SONICBANDUNG ... CHECK OUT OUR EXCLUSIVE MERCHANDISE AT THE OFFICIAL STORE ...
              STAY TUNED FOR MPL ID SEASON 17 NEWS ... THE SKY IS THE LIMIT! ...
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 60s linear infinite;
          padding-right: 150px;
        }
      `}</style>
    </section>
  )
}

export default VideoHighlights;