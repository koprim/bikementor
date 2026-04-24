import { Suspense, lazy, useCallback, useState } from 'react';
import PrestationCard from './PrestationCard.jsx';
import { prestations } from '../../lib/content/prestations.js';

const PrestationModal = lazy(() => import('./PrestationModal.jsx'));

export default function Prestations() {
  const [selected, setSelected] = useState(null);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <section id="prestations" className="mx-auto max-w-6xl px-4 py-24 md:px-8 md:py-32">
      <div className="flex items-baseline justify-between border-b pb-6" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <p className="font-[var(--font-mono)] text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--color-fg-subtle)' }}>01 / Services</p>
          <h2 className="mt-2 font-[var(--font-display)] text-3xl leading-tight md:text-4xl">Prestations</h2>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {prestations.map((p, i) => (
          <PrestationCard key={p.slug} prestation={p} index={i} onOpen={setSelected} />
        ))}
      </div>

      <Suspense fallback={null}>
        {selected && <PrestationModal open prestation={selected} onClose={handleClose} />}
      </Suspense>
    </section>
  );
}
