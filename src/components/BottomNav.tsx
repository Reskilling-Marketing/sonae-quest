import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", label: "ホーム", emoji: "🏠" },
  { to: "/shelters", label: "避難所", emoji: "📍" },
  { to: "/quests", label: "クエスト", emoji: "🗺️" },
  { to: "/stock", label: "備蓄", emoji: "📦" },
  { to: "/more", label: "もっと", emoji: "☰" },
];

export function BottomNav() {
  return (
    <nav
      aria-label="メインメニュー"
      className="safe-area-bottom fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-teal-100 bg-white/95 backdrop-blur"
    >
      <ul className="grid grid-cols-5 items-stretch">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex h-full flex-col items-center justify-center gap-0.5 py-2 text-xs-jp font-bold transition ${
                  isActive ? "text-sonae-primary" : "text-slate-400"
                }`
              }
            >
              <span aria-hidden className="text-xl leading-none">
                {item.emoji}
              </span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
