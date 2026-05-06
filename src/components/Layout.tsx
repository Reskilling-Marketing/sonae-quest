import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  back?: string;
  hideNav?: boolean;
}

export function Layout({ children, title, back, hideNav }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === "/" || location.pathname === "";

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-sonae-ground">
      <header className="safe-area-top sticky top-0 z-20 bg-sonae-ground/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            {back ? (
              <Link
                to={back}
                aria-label="戻る"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-soft"
              >
                ←
              </Link>
            ) : (
              <Link
                to="/"
                aria-label="ホーム"
                className="inline-flex items-center gap-2 text-lg-jp font-bold text-sonae-primary"
              >
                <span className="text-2xl">🛡️</span>
                <span>そなえクエスト</span>
              </Link>
            )}
          </div>
          {!isHome && title && (
            <h1 className="truncate text-base-jp font-bold text-sonae-ink">
              {title}
            </h1>
          )}
          <div className="w-10" />
        </div>
      </header>

      <main className="safe-area-bottom flex-1 px-4 pb-28 pt-2">
        {children}
      </main>

      {!hideNav && <BottomNav />}
    </div>
  );
}
