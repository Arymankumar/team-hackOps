import { Card } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-3xl text-white">Settings</h1>
      <p className="mt-2 text-ink-muted">Profile and preferences — extend with notification channels and API keys.</p>

      <Card className="mt-8 !p-6" hover={false}>
        <h2 className="font-medium text-white">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Name</label>
            <input readOnly className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm" value={user?.name ?? ""} />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-faint">Email</label>
            <input readOnly className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm" value={user?.email ?? ""} />
          </div>
        </div>
      </Card>

      <Card className="mt-6 !p-6" hover={false}>
        <h2 className="font-medium text-white">Appearance</h2>
        <p className="mt-2 text-sm text-ink-muted">Dark theme is the default for ShopForge AI. Light mode can be added with a CSS variable toggle.</p>
      </Card>
    </div>
  );
}
