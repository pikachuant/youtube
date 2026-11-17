import React, { useRef, useState } from "react";

function Upload() {
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbNail] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const videoRef = useRef(null);
  const thumbnailRef = useRef(null);

  const handleFileChange = function (e, video) {
    if (video) {
      setFile(e.target.files[0]);
    } else {
      setThumbNail(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!file) {
      newErrors.file = "Please select a video";
    }

    if (!thumbnail) {
      newErrors.thumbnail = "Please select a thumbnail";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const clearData = function () {
    setFile(null);
    setThumbNail(null);
    setTitle("");
    setDescription("");

    videoRef.current.value = "";
    thumbnailRef.current.value = "";
  };

  const handleUpload = async function () {
    if (loading) return;
    setErrors({});
    setSuccess("");

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    const formData = new FormData();

    formData.append("videoFile", file);
    formData.append("thumbnail", thumbnail);

    formData.append("titile", title);
    formData.append("description", description);

    try {
      setLoading(true);

      const response = await fetch(
        "https://antonpklive.online/v1/api/user/videoupload",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setErrors({
          server: data.message || "Something went wrong during upload",
        });
        return;
      }

      setSuccess(data.message);
      clearData();
    } catch (error) {
      setErrors({ server: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="upload-page">
      <div className="upload-card">
        <header className="upload-heading">
          <span className="upload-eyebrow">Share with your community</span>
          <h1>Upload a video</h1>
          <p>Add a title, description, and thumbnail before publishing.</p>
        </header>

        <div className="upload-fields">
          <label className="upload-field">
            <span>Title</span>
            <input
              type="text"
              value={title}
              placeholder="Give your video a title"
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && <small className="upload-error">{errors.title}</small>}
          </label>

          <label className="upload-field">
            <span>Description</span>
            <textarea
              value={description}
              placeholder="Tell viewers what your video is about"
              rows={4}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && <small className="upload-error">{errors.description}</small>}
          </label>

          <label className="upload-file-field" htmlFor="video-upload">
            <span className="upload-file-icon" aria-hidden="true">▶</span>
            <span className="upload-file-copy">
              <strong>Video file</strong>
              <small>{file ? file.name : "MP4, WebM, or QuickTime"}</small>
            </span>
            <span className="upload-file-action">Choose file</span>
            <input
              id="video-upload"
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              ref={videoRef}
              onChange={(e) => handleFileChange(e, true)}
            />
          </label>
          {errors.file && <small className="upload-error">{errors.file}</small>}

          <label className="upload-file-field" htmlFor="thumbnail-upload">
            <span className="upload-file-icon upload-file-icon--image" aria-hidden="true">▧</span>
            <span className="upload-file-copy">
              <strong>Thumbnail</strong>
              <small>{thumbnail ? thumbnail.name : "JPEG, PNG, or WebP image"}</small>
            </span>
            <span className="upload-file-action">Choose image</span>
            <input
              id="thumbnail-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              ref={thumbnailRef}
              onChange={(e) => handleFileChange(e, false)}
            />
          </label>
          {errors.thumbnail && <small className="upload-error">{errors.thumbnail}</small>}
        </div>

        {errors.server && <p className="upload-message upload-message--error" role="alert">{errors.server}</p>}
        {success && <p className="upload-message upload-message--success" role="status">{success}</p>}

        <button className="upload-submit" onClick={handleUpload} disabled={loading}>
          {loading ? "Uploading..." : "Upload video"}
        </button>
      </div>
    </section>
  );
}

export default Upload;
