export default function VideoPlayer({ src, poster, label, preload = 'none', className = '' }) {
  return (
    <video
      className={`size-full object-cover ${className}`}
      poster={poster}
      aria-label={label}
      muted
      autoPlay
      loop
      playsInline
      preload={preload}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
