import Modal from '../primitives/Modal.jsx';
import VideoPlayer from '../ui/VideoPlayer.jsx';
import WhatsAppButton from '../ui/WhatsAppButton.jsx';

function Chip({ children }) {
  return (
    <span
      className="inline-block rounded-full border px-2.5 py-0.5 font-[var(--font-mono)] text-xs uppercase tracking-[0.1em]"
      style={{ borderColor: 'var(--color-border)', color: 'var(--color-fg-muted)' }}
    >
      {children}
    </span>
  );
}

export default function PrestationModal({ open, prestation, onClose }) {
  if (!prestation) return null;
  const titleId = `prestation-${prestation.slug}-title`;
  const descId = `prestation-${prestation.slug}-desc`;

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId} describedBy={descId}>
      <div className="flex flex-col gap-6">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <VideoPlayer src={prestation.videoSrc} poster={prestation.poster} label={prestation.title} preload="auto" />
        </div>

        <div>
          <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>
            {prestation.title}
          </p>
          <h2 id={titleId} className="mt-2 font-[var(--font-display)] text-3xl leading-tight md:text-4xl">
            {prestation.title}
          </h2>
          <p id={descId} className="mt-3 text-base md:text-lg" style={{ color: 'var(--color-fg-muted)' }}>
            {prestation.summary}
          </p>
        </div>

        <div className="border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>
            Formats
          </h3>
          <ul className="mt-4 flex flex-col gap-5">
            {prestation.formats.map((f, i) => (
              <li key={i}>
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className="font-[var(--font-display)] text-lg leading-tight">{f.title}</h4>
                  {f.duration && <Chip>{f.duration}</Chip>}
                  {f.price && <Chip>{f.price}</Chip>}
                  {f.capacity && <Chip>{f.capacity}</Chip>}
                </div>
                <p className="mt-1 text-sm" style={{ color: 'var(--color-fg-muted)' }}>{f.description}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-start pt-2">
          <WhatsAppButton>Discuter sur WhatsApp</WhatsAppButton>
        </div>
      </div>
    </Modal>
  );
}
