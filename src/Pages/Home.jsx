import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'



function SkeletonCard() {
  return (
    <div className="video-skeleton">
      <div className="video-skeleton-thumb" />
      <div className="video-skeleton-info">
        <div className="video-skeleton-avatar" />
        <div className="video-skeleton-lines">
          <div className="video-skeleton-line" />
          <div className="video-skeleton-line" />
          <div className="video-skeleton-line" />
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [video, setVideo] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const checkVideo = async () => {
      try {
        const response = await fetch(
          'https://antonpklive.online/v1/api/user/get-feed-videos',
          { method: 'GET', credentials: 'include' }
        )
        const data = await response.json()
        console.log(data)
        if (data.success) {
          setVideo(data.data)
        } else {
          setError('Failed to fetch video feed')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    checkVideo()
  }, [])

  function timeAgo(createdAt) {
    const diff = new Date() - new Date(createdAt)
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    if (days > 0) return `${days} days ago`
    if (hours > 0) return `${hours} hours ago`
    return `${minutes} minutes ago`
  }

  function formatViews(views) {
    const n = views || 0
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`
    return `${n} views`
  }

  return (
    <>

      {error && <p className="home-error">{error}</p>}

      <div className="video-grid">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : video.map((item) => (
              <Link
                className="video-card"
                to={`/watch/${item._id}`}
                state={{ video: item }}
                key={item._id}
              >
                {/* Thumbnail */}
                <div className="video-thumbnail-wrapper">
                  <img src={item.thumbnail} alt={item.titile} />
                  <span className="video-duration">{item.duration}</span>
                </div>

                {/* Info row — YouTube style */}
                <div className="video-info">
                  <img
                    className="video-info-avatar"
                    src={item.owner.avatar}
                    alt={item.owner.username}
                  />
                  <div className="video-info-text">
                    <h3>{item.titile}</h3>
                    <span className="video-channel-name">{item.owner.username}</span>
                    <div className="video-meta-line">
                      <span>{formatViews(item.views)}</span>
                      <span className="video-meta-dot">•</span>
                      <span>{timeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </>
  )
}

export default Home