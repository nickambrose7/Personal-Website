export default function Project({ title, description, mediaUrl, projectUrl }) {
  const isVideo = mediaUrl && mediaUrl.endsWith('.mp4')

  return (
    <article className="project-card">
      <div className="project-media">
        {isVideo ? (
          <video
            className="project-video"
            src={mediaUrl}
            title={title}
            loop
            muted
            autoPlay
            playsInline
          />
        ) : (
          <img className="project-image" src={mediaUrl} alt={title} />
        )}
      </div>

      <div className="project-content">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>

        {projectUrl ? (
          <div className="project-actions">
            <a
              className="project-button"
              href={projectUrl}
              target="_blank"
              rel="noreferrer"
            >
              Learn More
            </a>
          </div>
        ) : null}
      </div>
    </article>
  )
}
