"use client"

const items = [
  {
    title: "Custom adapter layer",
    desc: "Drop‑in compatibility for dApps. Route connect/sign requests to the right provider while enforcing origin‑aware policies.",
  },
  {
    title: "Sharded key storage",
    desc: "Split private material into verifiable shares. Threshold retrieval means no single device or server holds the full key.",
  },
  {
    title: "Recovery built‑in",
    desc: "Secure recovery using trusted contacts or secondary devices. Rotate shares without changing the public address.",
  },
  {
    title: "Multi‑device sync",
    desc: "Authorize new devices with policy‑bound sessions. Minimal exposure with short‑lived, scope‑limited capabilities.",
  },
  {
    title: "dApp compatible",
    desc: "Expose a familiar provider shape (connect, signTransaction, signMessage) so existing apps work without changes.",
  },
  {
    title: "Defense in depth",
    desc: "Hardware isolation, rate‑limits, domain binding, and explicit user approvals — layered, not optional.",
  },
]

export default function WalletArchitectureSection() {
  return (
    <section className="w-full border-b border-[#E0DEDB] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E0DEDB] bg-white px-3 py-1 text-xs text-[#605A57]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#37322F]" />
          Architecture
        </div>

        <h3 className="font-serif text-balance text-2xl leading-tight text-[#37322F] md:text-4xl">
          Secure by design, compatible by default
        </h3>
        <p className="mt-3 max-w-prose text-[#49423D]">
          A minimal, familiar API for apps with a modern custody model for users. No seed phrases, no vendor lock‑in —
          just provable control and simple recovery.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article key={it.title} className="rounded-xl border border-[#E0DEDB] bg-white p-5">
              <h4 className="font-serif text-lg text-[#37322F]">{it.title}</h4>
              <p className="mt-2 text-sm leading-relaxed text-[#605A57]">{it.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
