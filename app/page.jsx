import Link from 'next/link';

const FEATURES = [
  {
    title: 'Get Real Customers',
    desc: 'Your business appears when nearby users are actively searching for trusted local services.',
  },
  {
    title: 'Real-Time Offers',
    desc: 'Launch promotions anytime and convert high-intent visitors into enquiries quickly.',
  },
  {
    title: 'WhatsApp Lead Management',
    desc: 'Receive and manage enquiries directly on WhatsApp without middlemen or commissions.',
  },
  {
    title: 'Premium Business Profile',
    desc: 'Show photos, services, pricing, and reviews in one conversion-focused profile page.',
  },
  {
    title: 'Verified Listings',
    desc: 'Only genuine businesses are onboarded, keeping platform trust and lead quality high.',
  },
  {
    title: 'Early Advantage',
    desc: 'Early partners get stronger visibility and locked pricing as SundayHundred scales.',
  },
];

const BILLING_OPTIONS = [
    { duration: '3 Months', price: '₹1999'},
  { duration: '3 Months', price: '₹2999', popular: true },
  { duration: '6 Months', price: '₹4999' },
  { duration: '12 Months', price: '₹7999' },
];

const PLAN_INCLUDES = [
  'Business profile page',
  'Category listing',
  'Contact details',
  'WhatsApp button',
  'Google map location',
  'Opening hours',
  'Photos gallery',
  'Early partner badge',
  'Visibility in city search',
];

const CATEGORIES = [
  'Salons & Spas',
  'Gyms & Yoga Studios',
  'Boutiques & Makeup Artists',
  'Clinics & Dermatologists',
  'Photographers',
  'Interior Designers',
  'Coaching Institutes',
  'Repair & Home Services',
  'Pet Services',
  'Freelancers',
];

const STEPS = [
  'Register your business',
  'Create your profile',
  'Start receiving enquiries',
  'Grow your visibility monthly',
];

const FAQS = [
  {
    q: 'Is this like JustDial?',
    a: 'No. SundayHundred focuses on real enquiries and lead flow, not just passive listing visibility.',
  },
  {
    q: 'Is the platform live?',
    a: 'Yes, MVP is live and onboarding early businesses right now.',
  },
  {
    q: 'Which cities are supported?',
    a: 'We are currently launching in selected areas and expanding city by city.',
  },
  {
    q: 'Do customers pay?',
    a: 'No. SundayHundred is free for customers who are searching for local services.',
  },
];

export default function RootPage() {
  return (
    <main className="relative overflow-hidden bg-dark-900 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-accent blur-3xl" />
        <div className="absolute top-72 -left-16 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-4 pb-10 pt-12 md:px-6 md:pt-16">
        <p className="inline-flex rounded-full border border-dark-700 bg-surface px-3 py-1 text-xs uppercase tracking-widest text-accent">
          Now live - onboarding early businesses
        </p>
        <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight md:text-5xl">
          Get More Customers Every Month - Not Just a Listing
        </h1>
        <p className="mt-4 max-w-3xl text-base text-dark-300 md:text-lg">
          SundayHundred helps local businesses get real enquiries, manage leads on WhatsApp, and grow consistently from one platform.
        </p>
        <p className="mt-2 text-sm text-dark-400 md:text-base">No commissions. No middlemen. Direct customer enquiries.</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/signup" className="rounded bg-accent px-5 py-2.5 text-sm font-semibold text-black hover:bg-accent-dark transition-colors">
            Get Started
          </Link>
           <Link href="/login" className="rounded bg-accent px-5 py-2.5 text-sm font-semibold text-black hover:bg-accent-dark transition-colors">
            Login
          </Link>
          {/* <Link href="/signup" className="rounded border border-dark-600 bg-surface px-5 py-2.5 text-sm font-medium hover:bg-surface-2 transition-colors">
            List Your Business
          </Link>
          <Link href="/signup" className="rounded border border-dark-600 bg-transparent px-5 py-2.5 text-sm font-medium hover:bg-surface transition-colors">
            View Demo
          </Link> */}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Metric label="Businesses Onboarded" value="Early Access" />
          <Metric label="Lead Channel" value="WhatsApp First" />
          <Metric label="Starting Price" value="₹1999 / month" />
        </div>
      </section>

      <section className="border-y border-dark-800 bg-surface/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-3 md:px-6">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold">Directories do not grow your business. Customers do.</h2>
            <p className="mt-3 text-sm leading-6 text-dark-300">
              Most platforms stop at showing your contact details. They do not help you generate daily enquiries,
              manage leads, launch instant offers, track performance, or retain customers.
            </p>
            <p className="mt-3 text-sm font-semibold text-white">SundayHundred solves this with one integrated growth stack.</p>
          </div>
          <div className="rounded border border-dark-700 bg-dark-900 p-5">
            <h3 className="text-lg font-semibold">How It Works</h3>
            <ol className="mt-3 space-y-2 list-decimal list-inside text-sm text-dark-300">
              {STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-bold">Key Features</h2>
        <p className="mt-2 text-sm text-dark-400">Your digital growth partner for local discovery + conversion.</p>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {FEATURES.map((item) => (
            <div key={item.title} className="rounded border border-dark-700 bg-surface p-5 hover:border-dark-500 transition-colors">
              <h3 className="text-base font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-dark-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10 md:px-6">
        <h2 className="text-2xl font-bold">Basic Listing Plan</h2>
        <p className="mt-2 text-sm text-dark-400">Also available at ₹1999 per month for monthly billing.</p>
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-lg border border-accent bg-accent-muted p-5">
            <p className="text-xs uppercase tracking-wider text-dark-400">Pricing</p>
            <div className="mt-4 space-y-3">
              {BILLING_OPTIONS.map((option) => (
                <div
                  key={option.duration}
                  className={`flex items-center justify-between rounded border px-4 py-3 ${
                    option.popular ? 'border-accent bg-accent-muted' : 'border-dark-700 bg-dark-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{option.duration}</p>
                    {option.popular && (
                      <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-accent">{option.price}</p>
                </div>
              ))}
            </div>
            <Link href="/signup" className="mt-5 inline-flex rounded bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-dark transition-colors">
              Choose Basic Plan
            </Link>
          </div>

          <div className="rounded-lg border border-dark-700 bg-surface p-5">
            <p className="text-xs uppercase tracking-wider text-dark-400">Includes</p>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-dark-300">
              {PLAN_INCLUDES.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-dark-800 bg-surface/50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 md:grid-cols-2 md:px-6">
          <div>
            <h2 className="text-2xl font-bold">Who Can Join</h2>
            <p className="mt-2 text-sm text-dark-400">Food delivery not included currently.</p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 text-sm text-dark-300">
              {CATEGORIES.map((category) => (
                <div key={category} className="rounded border border-dark-700 bg-dark-900 px-3 py-2">
                  {category}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded border border-dark-700 bg-dark-900 p-5">
            <h2 className="text-2xl font-bold">Early Partner Benefits</h2>
            <p className="mt-2 text-sm text-dark-400">Limited slots available.</p>
            <div className="mt-4 space-y-2 text-sm text-dark-300">
              <p>- Priority visibility</p>
              <p>- Early adopter badge</p>
              <p>- Locked pricing</p>
              <p>- Profile setup support</p>
              <p>- Featured placement</p>
            </div>
            <Link href="/signup" className="mt-5 inline-flex rounded bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-dark transition-colors">
              Join Early Access
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 md:px-6">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {FAQS.map((faq) => (
            <div key={faq.q} className="rounded border border-dark-700 bg-surface p-5">
              <p className="text-base font-semibold">{faq.q}</p>
              <p className="mt-2 text-sm text-dark-300">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 md:px-6">
        <div className="rounded border border-status-info bg-status-info-muted p-5">
          <h2 className="text-lg font-semibold">Razorpay Approval Checklist</h2>
          <p className="mt-1 text-sm text-dark-300">Recommended policy pages for smooth approval.</p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
            <Link href="/privacy-policy" className="rounded border border-dark-700 bg-dark-900 px-3 py-2 hover:bg-dark-800 transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="rounded border border-dark-700 bg-dark-900 px-3 py-2 hover:bg-dark-800 transition-colors">Terms & Conditions</Link>
            <Link href="/refund-policy" className="rounded border border-dark-700 bg-dark-900 px-3 py-2 hover:bg-dark-800 transition-colors">Refund Policy</Link>
            <Link href="/signup" className="rounded border border-dark-700 bg-dark-900 px-3 py-2 hover:bg-dark-800 transition-colors">Contact / Support</Link>
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
