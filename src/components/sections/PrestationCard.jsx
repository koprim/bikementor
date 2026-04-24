import VideoPlayer from '../ui/VideoPlayer.jsx';

export default function PrestationCard({ prestation, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(prestation)}
      className="group flex flex-col overflow-hidden rounded-xl border text-left transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-elevated)', outlineColor: 'var(--color-accent)' }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <VideoPlayer src={prestation.videoSrc} poster={prestation.poster} label={prestation.title} preload="none" />
        <span
          className="absolute left-4 top-4 font-[var(--font-mono)] text-xs uppercase tracking-[0.14em]"
          style={{ color: '#EBE6DD' }}
        >
          {String(index + 1).padStart(2, '0')} / {prestation.title}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-6">
        <h3 className="font-[var(--font-display)] text-xl leading-tight group-hover:text-[var(--color-accent)]">
          {prestation.title}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-fg-muted)' }}>{prestation.tagline}</p>
      </div>
    </button>
  );
}
