'use client';

/* eslint-disable @next/next/no-img-element */

import { toPng } from 'html-to-image';
import {
  Download,
  ImageUp,
  Palette,
  RefreshCw,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { CSSProperties, useCallback, useMemo, useRef, useState } from 'react';

type BackgroundOption = {
  id: string;
  label: string;
  accent: string;
  description: string;
  style: CSSProperties;
};

type Template = {
  id: string;
  name: string;
  headline: string;
  subheading: string;
  badgeText: string;
  price: string;
  cta: string;
  backgroundId: string;
  accent: string;
  glow: number;
  rotation: number;
  scale: number;
  gradientOpacity: number;
};

const backgroundOptions: BackgroundOption[] = [
  {
    id: 'clean-white',
    label: 'Clean Studio',
    accent: '#111827',
    description: 'Minimal, bright, perfect for tech products',
    style: {
      backgroundColor: '#f7f8fb',
      backgroundImage:
        'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9), transparent 55%), radial-gradient(circle at 80% 10%, rgba(226,232,255,0.8), transparent 50%)',
    },
  },
  {
    id: 'sunset',
    label: 'Sunset Glow',
    accent: '#f97316',
    description: 'Warm gradients that spotlight lifestyle items',
    style: {
      backgroundImage:
        'linear-gradient(135deg, #f59e0b 0%, #f97316 35%, #7c3aed 100%)',
    },
  },
  {
    id: 'velocity',
    label: 'Velocity',
    accent: '#38bdf8',
    description: 'Dynamic stripes for athletic & travel gear',
    style: {
      backgroundColor: '#020617',
      backgroundImage:
        'linear-gradient(115deg, rgba(14,165,233,0.3) 0%, rgba(14,165,233,0) 35%), repeating-linear-gradient(135deg, rgba(14,165,233,0.08), rgba(14,165,233,0.08) 12px, transparent 12px, transparent 28px)',
    },
  },
  {
    id: 'studio-mint',
    label: 'Studio Mint',
    accent: '#0ea5e9',
    description: 'Fresh pastel perfect for beauty or lifestyle',
    style: {
      backgroundImage:
        'linear-gradient(145deg, #b3f0ff 0%, #e0f7ff 40%, #fdf2ff 100%)',
    },
  },
  {
    id: 'precision',
    label: 'Precision Grid',
    accent: '#2563eb',
    description: 'Crafted grid aesthetic for mechanical products',
    style: {
      backgroundColor: '#0f172a',
      backgroundImage:
        'linear-gradient(rgba(30,41,59,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(30,41,59,0.2) 1px, transparent 1px)',
      backgroundSize: '32px 32px',
    },
  },
  {
    id: 'editorial',
    label: 'Editorial',
    accent: '#fb7185',
    description: 'High-fashion inspired editorial layout',
    style: {
      backgroundImage:
        'linear-gradient(135deg, #09090b 0%, #111827 60%, #db2777 100%)',
    },
  },
];

const templates: Template[] = [
  {
    id: 'hero',
    name: 'Hero Spotlight',
    headline: 'Premium Product Experience',
    subheading: 'Designed for creators who need production-ready visuals.',
    badgeText: 'Best Seller',
    price: '$149',
    cta: 'Shop the drop',
    backgroundId: 'clean-white',
    accent: '#2563eb',
    glow: 0.35,
    rotation: -6,
    scale: 110,
    gradientOpacity: 0.4,
  },
  {
    id: 'launch',
    name: 'Launch Hype',
    headline: 'Launch Day Ready',
    subheading: 'Capture attention with a cinematic gradient background.',
    badgeText: 'New Arrival',
    price: '$89',
    cta: 'Pre-order now',
    backgroundId: 'sunset',
    accent: '#fef08a',
    glow: 0.55,
    rotation: 3,
    scale: 120,
    gradientOpacity: 0.6,
  },
  {
    id: 'athletic',
    name: 'Athletic Pulse',
    headline: 'Engineered for speed',
    subheading: 'Aerodynamic design, lightweight build, race-ready focus.',
    badgeText: 'Race Ready',
    price: '$219',
    cta: 'See specs',
    backgroundId: 'velocity',
    accent: '#38bdf8',
    glow: 0.5,
    rotation: -12,
    scale: 115,
    gradientOpacity: 0.55,
  },
  {
    id: 'editorial',
    name: 'Editorial Luxe',
    headline: 'Limited edition capsule',
    subheading: 'Monochrome drama with a single accent highlight.',
    badgeText: 'Limited',
    price: '$329',
    cta: 'Discover',
    backgroundId: 'editorial',
    accent: '#fb7185',
    glow: 0.45,
    rotation: 8,
    scale: 105,
    gradientOpacity: 0.3,
  },
];

const cn = (...classNames: (string | false | null | undefined)[]) =>
  classNames.filter(Boolean).join(' ');

const toRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const bigint =
    sanitized.length === 3
      ? parseInt(
          sanitized
            .split('')
            .map((c) => c + c)
            .join(''),
          16,
        )
      : parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default function Home() {
  const exportRef = useRef<HTMLDivElement | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [headline, setHeadline] = useState('Design the product story you want to tell.');
  const [subheading, setSubheading] = useState(
    'Upload your product shot, remix the background, and export polished visuals in seconds.',
  );
  const [badgeText, setBadgeText] = useState('Trending now');
  const [price, setPrice] = useState('$129');
  const [cta, setCta] = useState('Add to cart');
  const [backgroundId, setBackgroundId] = useState<string>('clean-white');
  const [accentColor, setAccentColor] = useState('#2563eb');
  const [glowIntensity, setGlowIntensity] = useState(0.35);
  const [productRotation, setProductRotation] = useState(-5);
  const [productScale, setProductScale] = useState(110);
  const [gradientOpacity, setGradientOpacity] = useState(0.45);
  const [floatingBadge, setFloatingBadge] = useState(true);
  const [ctaVisible, setCtaVisible] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [showGrid, setShowGrid] = useState(false);

  const selectedBackground = useMemo(
    () => backgroundOptions.find((bg) => bg.id === backgroundId) ?? backgroundOptions[0],
    [backgroundId],
  );

  const handleUpload = useCallback((file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result?.toString() ?? null);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleReset = useCallback(() => {
    setUploadedImage(null);
    setHeadline('Design the product story you want to tell.');
    setSubheading(
      'Upload your product shot, remix the background, and export polished visuals in seconds.',
    );
    setBadgeText('Trending now');
    setPrice('$129');
    setCta('Add to cart');
    setBackgroundId('clean-white');
    setAccentColor('#2563eb');
    setGlowIntensity(0.35);
    setProductRotation(-5);
    setProductScale(110);
    setGradientOpacity(0.45);
    setFloatingBadge(true);
    setCtaVisible(true);
    setOverlayVisible(true);
    setShowGrid(false);
  }, []);

  const handleTemplate = useCallback((template: Template) => {
    setHeadline(template.headline);
    setSubheading(template.subheading);
    setBadgeText(template.badgeText);
    setPrice(template.price);
    setCta(template.cta);
    setBackgroundId(template.backgroundId);
    setAccentColor(template.accent);
    setGlowIntensity(template.glow);
    setProductRotation(template.rotation);
    setProductScale(template.scale);
    setGradientOpacity(template.gradientOpacity);
    setFloatingBadge(true);
    setCtaVisible(true);
    setOverlayVisible(true);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!exportRef.current) return;
    const dataUrl = await toPng(exportRef.current, {
      pixelRatio: 2,
      cacheBust: true,
      backgroundColor: '#ffffff',
    });
    const link = document.createElement('a');
    link.download = 'product-composition.png';
    link.href = dataUrl;
    link.click();
  }, []);

  const accentGlow = useMemo(() => {
    const accent = accentColor || selectedBackground.accent;
    const glow = Math.max(0, Math.min(1, glowIntensity));
    return `0px 48px 64px ${toRgba(accent, glow * 0.7)}, 0px 12px 32px ${toRgba(
      accent,
      glow * 0.4,
    )}`;
  }, [accentColor, glowIntensity, selectedBackground.accent]);

  const panelGradient = useMemo(() => {
    return `linear-gradient(145deg, ${toRgba(accentColor, 0.08)}, transparent 70%)`;
  }, [accentColor]);

  return (
    <div className="min-h-screen bg-slate-950/95 pb-24 text-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-14 lg:flex-row lg:gap-14">
        <aside
          className="flex w-full max-w-xl flex-col gap-8 rounded-3xl border border-white/5 bg-slate-900/60 p-8 shadow-xl backdrop-blur"
          style={{ backgroundImage: panelGradient }}
        >
          <header className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
              <Sparkles size={14} />
              Product Canvas
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Remix your product photography
            </h1>
            <p className="text-sm leading-relaxed text-white/60">
              Upload any product shot, pick a vibe, then fine-tune color, layout, and lighting. Export
              production-ready hero images in seconds.
            </p>
          </header>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between text-sm font-medium text-white/70">
              <span>Product image</span>
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/0 px-3 py-1 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
              >
                <RefreshCw size={14} />
                Reset
              </button>
            </div>
            <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/15 bg-white/[0.03] p-6 text-center transition hover:border-white/25 hover:bg-white/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                <ImageUp size={22} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {uploadedImage ? 'Replace product photo' : 'Drop your product shot'}
                </p>
                <p className="text-xs text-white/60">PNG or JPG, up to 10MB</p>
              </div>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(event) => handleUpload(event.target.files?.[0])}
              />
            </label>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-white/70">
              <Palette size={16} />
              Background mood
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {backgroundOptions.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    setBackgroundId(bg.id);
                    setAccentColor(bg.accent);
                  }}
                  className={cn(
                    'group flex flex-col gap-3 rounded-2xl border border-white/10 p-3 text-left transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/10',
                    backgroundId === bg.id && 'border-white/40 bg-white/15 shadow-lg shadow-black/30',
                  )}
                >
                  <div
                    className="h-24 w-full rounded-xl border border-white/10"
                    style={bg.style}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{bg.label}</p>
                    <p className="text-xs text-white/60">{bg.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-white/70">
              <Wand2 size={16} />
              Smart templates
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplate(template)}
                  className="group flex flex-col gap-3 rounded-xl border border-white/10 bg-white/0 p-4 text-left transition hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/10"
                >
                  <div
                    className="h-20 rounded-lg border border-white/10"
                    style={
                      backgroundOptions.find((bg) => bg.id === template.backgroundId)?.style
                    }
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{template.name}</p>
                    <p className="text-xs text-white/60">{template.headline}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Headline
              </label>
              <input
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                placeholder="Tell the product story"
              />
            </div>
            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Supporting line
              </label>
              <textarea
                value={subheading}
                onChange={(event) => setSubheading(event.target.value)}
                rows={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                placeholder="Add context, benefits, or product positioning"
              />
            </div>
            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Accent color
              </label>
              <input
                type="color"
                value={accentColor}
                onChange={(event) => setAccentColor(event.target.value)}
                className="h-10 w-full cursor-pointer rounded-xl border border-white/10 bg-transparent p-1"
              />
            </div>
            <div className="grid gap-3">
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                <span>Glow</span>
                <span className="text-[10px] text-white/50">{Math.round(glowIntensity * 100)}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(glowIntensity * 100)}
                onChange={(event) => setGlowIntensity(Number(event.target.value) / 100)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Scale
                </span>
                <input
                  type="range"
                  min={80}
                  max={160}
                  value={productScale}
                  onChange={(event) => setProductScale(Number(event.target.value))}
                />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Rotation
                </span>
                <input
                  type="range"
                  min={-20}
                  max={20}
                  value={productRotation}
                  onChange={(event) => setProductRotation(Number(event.target.value))}
                />
              </div>
            </div>
            <div className="grid gap-3">
              <label className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                <span>Gradient focus</span>
                <span className="text-[10px] text-white/50">{Math.round(gradientOpacity * 100)}%</span>
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(gradientOpacity * 100)}
                onChange={(event) => setGradientOpacity(Number(event.target.value) / 100)}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.01] p-5">
            <div className="grid gap-3">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Floating badge
              </label>
              <input
                value={badgeText}
                onChange={(event) => setBadgeText(event.target.value)}
                disabled={!floatingBadge}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30"
                placeholder="Badge copy"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  Price
                </span>
                <input
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10"
                />
              </div>
              <div className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                  CTA button
                </span>
                <input
                  value={cta}
                  onChange={(event) => setCta(event.target.value)}
                  disabled={!ctaVisible}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30 focus:bg-white/10 disabled:cursor-not-allowed disabled:bg-white/5 disabled:text-white/30"
                />
              </div>
            </div>
            <div className="flex flex-col gap-3 text-sm text-white/70">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={floatingBadge}
                  onChange={(event) => setFloatingBadge(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10"
                />
                Show floating badge
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={ctaVisible}
                  onChange={(event) => setCtaVisible(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10"
                />
                Show CTA button
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={overlayVisible}
                  onChange={(event) => setOverlayVisible(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10"
                />
                Accent overlay
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(event) => setShowGrid(event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10"
                />
                Design grid
              </label>
            </div>
          </section>
        </aside>

        <section className="flex grow flex-col items-center gap-6">
          <div className="flex w-full flex-col items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.08] px-6 py-4 text-sm text-white/70 shadow-2xl shadow-black/40 backdrop-blur-sm lg:flex-row">
            <div className="flex items-center gap-2 text-sm text-white">
              <Sparkles size={16} />
              High-resolution export ready for Vercel deployments.
            </div>
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-medium text-slate-900 transition hover:bg-white/90"
              >
                <Download size={16} />
                Download PNG
              </button>
            </div>
          </div>

          <div
            ref={exportRef}
            className="relative aspect-[4/5] w-full max-w-[700px] overflow-hidden rounded-[40px] border border-white/10 shadow-[0_48px_100px_-40px_rgba(15,23,42,0.9)]"
            style={selectedBackground.style}
          >
            {showGrid && (
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_65%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
              </div>
            )}
            {overlayVisible && (
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${toRgba(
                    accentColor,
                    gradientOpacity,
                  )}, transparent 65%)`,
                }}
              />
            )}

            <div className="relative z-10 flex h-full flex-col justify-between p-10">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                  {floatingBadge && (
                    <div
                      className="inline-flex items-center rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900"
                      style={{
                        backgroundColor: toRgba(accentColor, 0.85),
                        boxShadow: accentGlow,
                      }}
                    >
                      {badgeText}
                    </div>
                  )}
                  <div className="h-px flex-1 bg-white/30" />
                </div>
                <div className="space-y-4">
                  <h2 className="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
                    {headline}
                  </h2>
                  <p className="max-w-lg text-base text-white/70">{subheading}</p>
                </div>
              </div>

              <div className="relative flex grow items-center justify-center">
                {uploadedImage ? (
                  <img
                    src={uploadedImage}
                    alt="Uploaded product"
                    className="max-h-[70%] max-w-[80%] select-none object-contain"
                    style={{
                      transform: `scale(${productScale / 100}) rotate(${productRotation}deg)`,
                      filter: `drop-shadow(${accentGlow})`,
                    }}
                  />
                ) : (
                  <div className="flex h-[60%] w-[80%] items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 text-center text-sm text-white/60">
                    Upload a product photo to begin transforming your scene.
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-end gap-2 text-white">
                  <span className="text-3xl font-semibold">{price}</span>
                  <span className="text-xs uppercase tracking-[0.4em] text-white/50">
                    Limited drop
                  </span>
                </div>
                {ctaVisible && (
                  <button
                    className="inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
                    style={{ boxShadow: accentGlow }}
                  >
                    {cta}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
