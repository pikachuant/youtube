import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../Context/Authcontext";
import Commentsection from "../components/commentsection/Commentsection";

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)}mo ago`;
  return `${Math.floor(diff / 31536000)}y ago`;
}

/* ── Inline SVG icons ── */
const IconPlay = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5,3 19,12 5,21" />
  </svg>
);
const IconPause = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="4" width="4" height="16" rx="1.5" />
    <rect x="14" y="4" width="4" height="16" rx="1.5" />
  </svg>
);
const IconVolumeMute = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <line x1="23" y1="9" x2="17" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="17" y1="9" x2="23" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const IconVolumeLow = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);
const IconVolumeHigh = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 5L6 9H2v6h4l5 4V5z" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);
const IconFullscreen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);
const IconSettings = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const IconThumbUp = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z" />
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
  </svg>
);

const IconBell = ({ active }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconMsg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

function formatNum(n) {
  if (!n) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function Player() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState({});
  const [isliked, setIsLiked] = useState(false);
  const [issubscribed, setIsSubscribed] = useState();
  const [video, setVideo] = useState();
  const [descExpanded, setDescExpanded] = useState(false);

  const { videoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // ── Video player state ──
  const videoRef = useRef(null);
  const settingRef = useRef(null);
  const viewCountedRef = useRef(false);
  const [isplaying, setisPlaying] = useState(true);
  const [ismute, setIsMute] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showSetting, setShowSetting] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [playBackSpeed, setPlayBackSpeed] = useState(1);
  const [duration, setDuration] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const h = (e) => {
      if (settingRef.current && !settingRef.current.contains(e.target)) {
        setShowSetting(false);
        setShowSpeed(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(
          `https://antonpklive.online/v1/api/user/video/${videoId}`,
          { method: "GET", credentials: "include" },
        );
        const data = await res.json();
        if (!data.success) {
          setError(data.message);
          return;
        }
        setVideo(data.data);
        setIsSubscribed(data.data.isSubscribed);
        setIsLiked(data.data.isLiked)
      } catch (e) {
        setError(e.message);
      }
    };

    fetchVideo();

  }, [videoId]);

  const likesControlForVideo = async () => {
    if (loading) return;
    try {
      setLoading(true);
      if (isliked) {
        const res = await fetch(
          "https://antonpklive.online/v1/api/user/user/unlike",
          {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: video._id, targetType: "Video" }),
          },
        );
        const data = await res.json();
        if (!data.success) { setError(data.message); return; }
        setIsLiked(false);
        setLikes((p) => ({ ...p, totalLikes: p.totalLikes - 1 }));
      } else {
        const res = await fetch(
          "https://antonpklive.online/v1/api/user/user/like",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: video._id, targetType: "Video" }),
          },
        );
        const data = await res.json();
        if (!data.success) { setError(data.message); return; }
        setIsLiked(true);
        setLikes((p) => ({ ...p, totalLikes: p.totalLikes + 1 }));
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://antonpklive.online/v1/api/user/${issubscribed ? "unsubscribe" : "subscribe"}/${video?.owner._id}`,
        { method: issubscribed ? "DELETE" : "POST", credentials: "include" },
      );
      const data = await res.json();
      if (!data.success) {
        setError(data.message);
        return;
      }
      setIsSubscribed(!issubscribed);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    videoRef.current.paused
      ? videoRef.current.play()
      : videoRef.current.pause();
  };
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) await videoRef.current.requestFullscreen();
    else await document.exitFullscreen();
  };
  const muteControl = () => {
    const v = videoRef.current;
    v.muted = !v.muted;
    setIsMute(v.muted);
  };
  const formatTime = (t) => {
    if (!Number.isFinite(t)) return "0:00";
    const m = Math.floor(t / 60),
      s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const addView = async () => {
    try {
      await fetch("https://antonpklive.online/v1/api/user/addviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: videoId }),
      });
    } catch {}
  };

  const changeSpeed = (s) => {
    videoRef.current.playbackRate = s;
    setPlayBackSpeed(s);
    setShowSpeed(false);
    setShowSetting(false);
  };
  const handleSeek = (e) => {
    const t = Number(e.target.value);
    videoRef.current.currentTime = t;
    setCurrentTime(t);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;
  
  const VolumeIcon =
    ismute || volume === 0
      ? IconVolumeMute
      : volume < 0.5
        ? IconVolumeLow
        : IconVolumeHigh;

  return (
    <div className="player-page">
      <div className="player-main">
        {/* ══ Video Player ══ */}
        <div className="player-video-wrap">
          {!videoLoaded && video?.thumbnail && (
            <img className="player-thumbnail" src={video.thumbnail} alt="thumbnail" />
          )}
          <video
            className="player-video"
            ref={videoRef}
            src={video?.videoFile}
            poster={video?.thumbnail}
            autoPlay
            muted={ismute}
            onClick={togglePlay}
            onPlay={() => setisPlaying(true)}
            onPause={() => setisPlaying(false)}
            onWaiting={() => setIsBuffering(true)}
            onCanPlay={() => {
              setIsBuffering(false);
              setVideoLoaded(true);
            }}
            controlsList="nodownload"
            onLoadedMetadata={() => {
              setDuration(videoRef.current.duration);
              const saved = localStorage.getItem("volume");
              const vol = saved !== null ? Number(saved) : 0.4;
              videoRef.current.volume = vol;
              setVolume(vol);
            }}
            onTimeUpdate={() => {
              const t = videoRef.current.currentTime;
              setCurrentTime(t);
              if (t >= 10 && !viewCountedRef.current) {
                viewCountedRef.current = true;
                addView();
              }
            }}
          />
          {isBuffering && (
            <div className="player-buffer-overlay">
              <div className="player-spinner" />
            </div>
          )}

          <div className="player-controls-wrap">
            {/* Seek bar */}
            <div className="player-seekbar-row">
              <div className="player-seekbar-track">
                <div className="player-seekbar-fill" style={{ width: `${progress}%` }}>
                  <div className="player-seekbar-thumb" />
                </div>
                <input
                  className="player-seekbar-input"
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime || 0}
                  step={0.1}
                  onChange={handleSeek}
                />
              </div>
            </div>

            {/* Controls bar */}
            <div className="player-controls-bar">
              <div className="player-controls-left">
                <button className="player-ctrl-btn" onClick={togglePlay}>
                  {isplaying ? <IconPause /> : <IconPlay />}
                </button>
                <div className="player-volume-group">
                  <button className="player-ctrl-btn" onClick={muteControl}>
                    <VolumeIcon />
                  </button>
                  <div className="player-volume-slider-wrap">
                    <div className="player-volume-track">
                      <div className="player-volume-fill" style={{ width: `${(ismute ? 0 : volume) * 100}%` }} />
                    </div>
                    <input
                      className="player-volume-input"
                      type="range"
                      min="0"
                      max="1"
                      step="0.025"
                      value={ismute ? 0 : volume}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setVolume(v);
                        setIsMute(v === 0);
                        videoRef.current.volume = v;
                        videoRef.current.muted = v === 0;
                        localStorage.setItem("volume", v);
                      }}
                    />
                  </div>
                </div>
                <span className="player-time">
                  <span>{formatTime(currentTime)}</span>
                  <span className="player-time-sep"> / </span>
                  <span>{formatTime(duration)}</span>
                </span>
              </div>

              <div className="player-controls-right">
                <div className="player-settings-wrap" ref={settingRef}>
                  <button
                    className="player-ctrl-btn"
                    aria-label="Playback settings"
                    aria-expanded={showSetting}
                    onClick={() => {
                      setShowSetting((p) => !p);
                      setShowSpeed(false);
                    }}
                  >
                    <IconSettings />
                  </button>
                  {showSetting && (
                    <div className="player-settings-menu">
                      <div className="player-settings-title">Settings</div>
                      <button className="player-settings-item" aria-expanded={showSpeed} onClick={() => setShowSpeed((p) => !p)}>
                        <span>Playback speed</span>
                        <span className="player-settings-value">
                          {playBackSpeed === 1 ? "Normal" : `${playBackSpeed}x`}{" "}
                          <IconChevronRight />
                        </span>
                      </button>
                    </div>
                  )}
                  {showSpeed && (
                    <div className="player-settings-menu player-speed-menu">
                      <div className="player-settings-title">Playback speed</div>
                      {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map((s) => (
                        <button
                          className={`player-settings-item player-speed-item${playBackSpeed === s ? " active" : ""}`}
                          key={s}
                          onClick={() => changeSpeed(s)}
                        >
                          {s === 1 ? "Normal" : `${s}x`}
                          {playBackSpeed === s && (
                            <span className="player-settings-check">
                              <IconCheck />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={toggleFullscreen}>
                  <IconFullscreen />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ══ Title ══ */}
        <div className="player-title-wrap">
          {video ? (
            <h1 className="player-title">{video?.titile || video?.title || "Untitled Video"}</h1>
          ) : (
            <div className="player-skeleton player-skeleton-title" />
          )}
        </div>

        {/* ══ Channel row ══ */}
        <div className="player-meta-row">
          <div className="player-channel-info">
            {video?.owner?.avatar ? (
              <img className="player-avatar" src={video.owner.avatar} alt={video.owner.username} />
            ) : (
              <div className="player-avatar-fallback">
                {video?.owner?.username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div className="player-channel-text">
              {video ? (
                <>
                  <span className="player-channel-name">{video.owner?.username}</span>
                  <span className="player-subs">{formatNum(video.subscriberCount)} subscribers</span>
                </>
              ) : (
                <>
                  <div />
                  <div />
                </>
              )}
            </div>
          </div>

          <div className="player-actions">
            {user?._id ? (
              <button className={`player-subscribe-btn${issubscribed ? " subscribed" : ""}`} onClick={handleSubscribe} disabled={loading}>
                {issubscribed ? (
                  <>
                    <IconBell active />
                    <span>Subscribed</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            ) : (
              <button
                className="player-subscribe-btn"
                onClick={() =>
                  navigate("/login", {
                    state: { from: location.pathname + location.search },
                  })
                }
              >
                <span>Subscribe</span>
              </button>
            )}
          </div>

          <div>
            <button className={`player-like-btn${isliked ? " liked" : ""}`} onClick={likesControlForVideo} disabled={loading}>
              <IconThumbUp filled={isliked} />
              <span>{formatNum(video?.totalLikes)}</span>
            </button>
            <div className="player-views">
              <IconEye />
              <span>{formatNum(video?.views)} views</span>
            </div>
          </div>
        </div>

        {/* ══ Description ══ */}
        {video?.description && (
          <div className={`player-desc${descExpanded ? " expanded" : ""}`}>
            <p className="player-desc-time">{timeAgo(video.createdAt)}</p>
            <p className="player-desc-text">{video.description}</p>
            {video.description.length > 160 && (
              <button className="player-desc-toggle" onClick={() => setDescExpanded((p) => !p)}>
                {descExpanded ? "Show less" : "Show more"}
              </button>
            )}
          </div>
        )}

        {/* ══ Comments ══ */}
        <div className="player-comments-section">
          <div className="player-comments-header">
            <IconMsg />
            <span>Comments</span>
          </div>
          {error && <div className="player-error">{error}</div>}
          <Commentsection targetId={videoId} targetType="Video" />
        </div>
      </div>
    </div>
  );
}

export default Player;
