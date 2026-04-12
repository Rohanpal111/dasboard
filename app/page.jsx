import Link from 'next/link';

const FEATURES = [
  {
    title: 'Live offers system',
    desc: 'Post daily deals that show up when nearby customers are already looking to buy.',
  },
  {
    title: 'Featured listing ads',
    desc: 'Push your business to the top for higher visibility and more attention.',
  },
  {
    title: 'Combo deals',
    desc: 'Create joint offers with other businesses and attract more local customers together.',
  },
  {
    title: 'Business profile page',
    desc: 'Show photos, services, contact details, and trust signals in one conversion-ready page.',
  },
  {
    title: 'WhatsApp enquiry button',
    desc: 'Let customers message you directly without extra steps or middlemen.',
  },
  {
    title: 'Local category visibility',
    desc: 'Appear where customers search by category, city, and service type.',
  },
];

const BILLING_OPTIONS = [
  {
    duration: '1 Month',
    price: '₹1999',
    description: 'Perfect to start quickly and test lead flow in your local area.',
  },
  {
    duration: '3 Months',
    price: '₹2999',
    popular: true,
    description: 'Most chosen plan for steady visibility and consistent enquiry growth.',
  },
  {
    duration: '6 Months',
    price: '₹4999',
    description: 'Better long-term value for businesses running offers throughout the season.',
  },
  {
    duration: '12 Months',
    price: '₹7999',
    description: 'Best yearly commitment for uninterrupted promotion and brand trust.',
  },
];

const PLAN_INCLUDES = [
  'Unlimited offer posting',
  'Direct customer leads',
  'QR code promotion tool',
  'WhatsApp enquiry button',
  'Business profile page',
  'Featured listing ads',
  'Local category search visibility',
  'Combo deal support',
];

const CATEGORY_NAMES = [
  'Salons',
  'Spas',
  'Nail Studios',
  'Makeup Artists',
  'Boutiques Cafe (Dine-In Only)',
  'Restaurant (Dine-In Only)',
  'Gyms',
  'Yoga Studios',
  'Zumba Classes name',
  'Dieticians',
  'Banquet Halls',
  'Decorators',
  'Caterers',
  'Tuition Centres Dance Classes',
  'Music Classes',
  'Coding Schools',
  'Photographers',
  'Videographers Studio Rentals',
  'Pet Shops',
  'Gift Stores',
  'Bookstores',
  'Property Dealers Rental Listings',
  'Interior Designers',
  'Tattoo Studios',
  'Car Wash',
  'Astrology Tailors',
  'DJs',
  'Mehendi Artists',
  'Party Lawns',
  'Stationery',
];

const CATEGORIES = CATEGORY_NAMES.map((name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  name,
  slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  isActive: true,
  imageUrl: '',
}));

const STEPS = [
  'Create your business profile',
  'Post live offers anytime',
  'Customers contact you directly',
];

export default function RootPage() {
  return (
    <main className="relative overflow-hidden bg-dark-900 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent blur-3xl" />
        <div className="absolute top-72 -left-16 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-7xl px-4 pb-12 pt-12 md:px-6 md:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div>
            <p className="inline-flex rounded-full border border-dark-700 bg-surface px-3 py-1 text-xs uppercase tracking-[0.28em] text-accent">
              Now live for early businesses
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight md:text-6xl">
              Get daily customers for your business
            </h1>
            <p className="mt-4 max-w-3xl text-base text-dark-300 md:text-lg">
              Show real-time offers to nearby customers looking for the best local deals.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded bg-accent px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-accent-dark">
                Get Listed Now
              </Link>
              <Link href="https://app.sundayhundred.com" target="_blank" rel="noreferrer" className="rounded border border-dark-600 bg-surface px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-800">
                View Customer Platform
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-dark-400">
              <Link href="/terms-and-conditions" className="hover:text-white hover:underline">
                Terms & Conditions
              </Link>
              <Link href="/privacy-policy" className="hover:text-white hover:underline">
                Privacy Policy
              </Link>
              <Link href="/refund-policy" className="hover:text-white hover:underline">
                Refund Policy
              </Link>
            </div>

            <div className="mt-5 rounded-2xl border border-accent/40 bg-accent-muted px-4 py-3 text-sm font-medium text-white shadow-lg shadow-black/10">
              Customers search for the best deals before visiting any business.
            </div>

            <p className="mt-3 text-sm text-dark-400">
              Early businesses get extra visibility advantage.
            </p>

            {/* <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Metric label="Positioning" value="Marketing + leads" />
              <Metric label="Lead flow" value="WhatsApp first" />
              <Metric label="Starting from" value="₹1999" />
            </div> */}
          </div>

          <div className="rounded-3xl border border-dark-700 bg-surface p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <h2 className="text-2xl font-bold">Business Login</h2>
            <p className="mt-1 text-sm text-dark-400">For registered businesses</p>
            <p className="mt-5 rounded-2xl border border-dark-700 bg-dark-900 px-4 py-3 text-sm text-dark-300">
              Access your dashboard, offers, and leads in one place.
            </p>
            <Link href="/login" className="mt-4 inline-flex w-full items-center justify-center rounded bg-white px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-dark-200">
              Login
            </Link>
            <p className="mt-4 text-xs leading-5 text-dark-400">
              Your business profile, offers, ads, and leads all stay connected in one growth tool.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-dark-800 bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <h2 className="text-2xl font-bold md:text-3xl">All-in-one local marketing platform</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-dark-300 md:text-base">
            Sunday Hundred is not only a listing site. It is a growth tool built to promote offers, run featured ads, create combo deals, and bring direct customer enquiries.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              'Post unlimited offers anytime',
              'Get direct WhatsApp enquiries',
              'Appear in local category search',
              'Run ads to show business at top',
              'Create combo deals with other businesses',
              'Promote deals daily to nearby customers',
              'Affordable monthly cost',
            ].map((point) => (
              <div key={point} className="rounded-xl border border-dark-700 bg-dark-900 p-4 text-sm text-dark-200">
                {point}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="mt-2 text-3xl font-bold">Why businesses join</h2>
            <p className="mt-3 text-sm text-dark-400 md:text-base">
              Businesses join because Sunday Hundred helps them show offers, get leads, and stay visible when customers are ready to buy.
            </p>
            {/* <div className="mt-6 rounded-2xl border border-dark-700 bg-surface p-5">
              <h3 className="text-lg font-semibold">Who this is for</h3>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-dark-300 sm:grid-cols-3">
                {['Salon', 'Spa', 'Gym', 'Boutique', 'Clinic', 'Freelancers'].map((item) => (
                  <div key={item} className="rounded border border-dark-700 bg-dark-900 px-3 py-2">
                    {item}
                  </div>
                ))}
              </div>
            </div> */}
          </div>

          {/* <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: 'Get direct WhatsApp enquiries',
                desc: 'Customers contact you directly, so your offers convert faster.',
              },
              {
                title: 'Run featured ads',
                desc: 'Promote your business at the top when competition matters most.',
              },
              {
                title: 'Build combo deals',
                desc: 'Partner with other businesses and create joint offers for more reach.',
              },
              {
                title: 'Show up in local search',
                desc: 'Appear when people search by category, service, or nearby area.',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-dark-700 bg-surface p-5">
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-dark-300">{item.desc}</p>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      <section className="border-y border-dark-800 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <h2 className="mt-2 text-3xl font-bold">Simple 3 step system</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {STEPS.map((step, index) => (
              <div key={step} className="rounded-2xl border border-dark-700 bg-dark-900 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-accent">Step 0{index + 1}</p>
                <p className="mt-3 text-lg font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h2 className="mt-2 text-3xl font-bold">Powerful growth features</h2>
        <p className="mt-3 max-w-3xl text-sm text-dark-400 md:text-base">
          The platform is built for growth: offers, ads, leads, profile visibility, QR promotion, and repeat customer discovery in one place.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.concat([
            { title: 'QR code promotion tool', desc: 'Share a QR code at your shop, counter, or events to attract instant visits.' },
            { title: 'Unlimited offer posting', desc: 'Keep publishing new offers as often as your business needs.' },
            { title: 'Direct customer leads', desc: 'Turn local interest into real business enquiries faster.' },
          ]).map((item) => (
            <div key={item.title} className="rounded-2xl border border-dark-700 bg-surface p-5 transition-colors hover:border-dark-500">
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-dark-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-dark-800 bg-surface/60">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <h2 className="mt-2 text-3xl font-bold">Businesses that can grow with Sunday Hundred</h2>
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.filter((category) => category.isActive).map((category) => (
              <div
                key={category.id}
                className="flex h-16 items-center justify-center rounded-xl border border-dark-700 bg-dark-900 px-3 text-center transition-colors hover:border-dark-500 hover:bg-dark-800"
              >
                <p className="text-xs font-medium leading-4 text-dark-100 sm:text-sm">{category.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h2 className="mt-2 text-3xl font-bold">Simple affordable pricing</h2>
        <p className="mt-3 text-sm text-dark-400 md:text-base">Early bird pricing for first businesses.</p>
        <div className="mt-6 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-3 sm:grid-cols-2">
            {BILLING_OPTIONS.map((option) => (
              <div
                key={option.duration}
                className={`rounded-2xl border p-4 ${option.popular ? 'border-accent bg-gradient-to-b from-accent-muted to-surface' : 'border-dark-700 bg-surface'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-dark-400">{option.duration}</p>
                    <p className="mt-2 text-2xl font-extrabold text-accent">{option.price}</p>
                  </div>
                  {option.popular ? (
                    <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-black">
                      Best value
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-5 text-dark-300">
                  {option.description}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-dark-700 bg-dark-900 p-4 md:p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-dark-400">What you get</p>
            <h3 className="mt-2 text-xl font-bold">Built to drive growth</h3>
            <ul className="mt-4 grid grid-cols-1 gap-2 text-sm text-dark-200 sm:grid-cols-2 xl:grid-cols-1">
              {PLAN_INCLUDES.map((item) => (
                <li key={item} className="rounded-lg border border-dark-700 bg-surface px-3 py-2.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-dark-700 bg-dark-900 px-4 py-3 text-sm text-dark-300">
          Early bird pricing for first businesses.
        </div>
      </section>

      <section className="border-y border-dark-800 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="rounded-3xl border border-dark-700 bg-gradient-to-r from-accent-muted to-surface p-6 md:p-8">
            <h2 className="mt-2 text-3xl font-bold md:text-4xl">Start getting customers today</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/signup" className="rounded bg-accent px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-accent-dark">
                Get listed now
              </Link>
              <Link href="https://app.sundayhundred.com" target="_blank" rel="noreferrer" className="rounded border border-dark-600 bg-surface px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-dark-800">
                View Customer Platform
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded border border-dark-700 bg-surface px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-dark-400">{label}</p>
      <p className="mt-1 text-lg font-bold text-white">{value}</p>
    </div>
  );
}
