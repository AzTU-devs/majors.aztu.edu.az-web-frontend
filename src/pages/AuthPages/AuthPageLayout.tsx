import React from "react";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-brand-400/30 blur-3xl dark:bg-brand-500/30" />
        <div className="absolute -bottom-40 -right-32 h-[520px] w-[520px] rounded-full bg-accent-400/30 blur-3xl dark:bg-accent-500/30" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <aside className="relative hidden overflow-hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:p-12 xl:p-16">
          <div className="absolute inset-0 brand-gradient opacity-95" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="absolute -bottom-24 -right-16 h-[420px] w-[420px] rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <img
                src="/aztu-logo-light.png"
                alt="AZTU"
                className="h-7 w-7 object-contain"
              />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white/95">
              AZTU Majors
            </span>
          </div>

          <div className="relative z-10 max-w-md text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              İxtisas idarəetmə platforması
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
              Tədris proqramlarını
              <span className="block bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                tək bir yerdən idarə edin.
              </span>
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/75">
              İxtisaslar, fənlər, kafedralar və öyrənmə nəticələri üçün
              müasir, sürətli və təhlükəsiz idarəetmə paneli.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4">
            {[
              { v: "PLO", l: "Proqram nəticələri" },
              { v: "SLO", l: "Tələbə nəticələri" },
              { v: "CLO", l: "Fənn nəticələri" },
            ].map((s) => (
              <div
                key={s.v}
                className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
              >
                <div className="text-xl font-semibold text-white">{s.v}</div>
                <div className="mt-1 text-xs text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </aside>

        <main className="relative flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2">
          <div className="absolute right-6 top-6 lg:hidden">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              <img
                src="/aztu-logo-light.png"
                alt="AZTU"
                className="h-7 w-7 object-contain dark:hidden"
              />
              <img
                src="/aztu-logo-dark.webp"
                alt="AZTU"
                className="hidden h-7 w-7 object-contain dark:block"
              />
              <span>AZTU Majors</span>
            </Link>
          </div>

          <div className="w-full max-w-md surface-card p-8 sm:p-10">
            {children}
          </div>
        </main>

        <div className="fixed bottom-6 right-6 z-50 hidden sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}
