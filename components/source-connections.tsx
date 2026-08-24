"use client";

import { useEffect, useState } from "react";
import {
  ApiError,
  EXCHANGE_PROVIDER_LABELS,
  WALLET_CHAIN_LABELS,
  addWalletAddress,
  createExchangeConnection,
  importCsv,
  listExchangeConnections,
  listWalletAddresses,
  removeExchangeConnection,
  removeWalletAddress,
  syncExchangeConnection,
  syncWalletAddress,
  verifyExchangeConnection,
  type ExchangeConnection,
  type ExchangeProvider,
  type WalletAddress,
  type WalletChain,
} from "@/lib/auth-client";

type Tab = "exchange" | "wallet" | "csv";

const TABS: { id: Tab; label: string }[] = [
  { id: "exchange", label: "Borsa hesabı" },
  { id: "wallet", label: "Cüzdan adresi" },
  { id: "csv", label: "CSV içe aktar" },
];

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-gold/20 bg-parchment p-5">
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-semibold tracking-wide text-ink-soft uppercase">
      {children}
    </label>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-gold/25 bg-cream px-3 py-2 text-sm text-ink outline-none focus:border-gold";

function ExchangeConnectionForm({ onAdded }: { onAdded: () => void }) {
  const [provider, setProvider] = useState<ExchangeProvider>("BINANCE");
  const [label, setLabel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmed) {
      setError("Salt-okunur (read-only) bir API key kullandığını onaylamalısın.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await createExchangeConnection({
        provider,
        label: label || EXCHANGE_PROVIDER_LABELS[provider],
        apiKey,
        apiSecret,
        passphrase: provider === "OKX" ? passphrase : undefined,
        confirmedReadOnly: confirmed,
      });
      setLabel("");
      setApiKey("");
      setApiSecret("");
      setPassphrase("");
      setConfirmed(false);
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Borsa hesabı eklenemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <FieldLabel>Borsa</FieldLabel>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value as ExchangeProvider)}
          className={inputClass}
        >
          {Object.entries(EXCHANGE_PROVIDER_LABELS).map(([value, name]) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel>Etiket (opsiyonel)</FieldLabel>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder={EXCHANGE_PROVIDER_LABELS[provider]}
          className={inputClass}
        />
      </div>
      <div>
        <FieldLabel>API Key</FieldLabel>
        <input
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          required
          minLength={8}
          className={inputClass}
        />
      </div>
      <div>
        <FieldLabel>API Secret</FieldLabel>
        <input
          type="password"
          value={apiSecret}
          onChange={(e) => setApiSecret(e.target.value)}
          required
          minLength={8}
          className={inputClass}
        />
      </div>
      {provider === "OKX" && (
        <div>
          <FieldLabel>Passphrase</FieldLabel>
          <input
            type="password"
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      )}
      <label className="mt-1 flex items-start gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-gold/40 accent-gold-deep"
        />
        Bu API key&apos;in <strong className="text-ink">salt-okunur (read-only)</strong>{" "}
        olduğunu, para çekme yetkisi olmadığını onaylıyorum.
      </label>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
      >
        {submitting ? "Ekleniyor…" : "Borsa hesabını bağla"}
      </button>
    </form>
  );
}

function ExchangeConnectionList({
  connections,
  onChanged,
}: {
  connections: ExchangeConnection[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function withBusy(id: string, fn: () => Promise<unknown>) {
    setBusyId(id);
    try {
      await fn();
      onChanged();
    } catch {
      // liste zaten hata durumunda eski haliyle kalir, kullanici tekrar dener
    } finally {
      setBusyId(null);
    }
  }

  if (connections.length === 0) {
    return <p className="text-sm text-ink-soft">Henüz bağlı borsa hesabın yok.</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {connections.map((c) => (
        <li
          key={c.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gold/15 bg-cream px-3.5 py-2.5 text-sm"
        >
          <div>
            <p className="font-medium text-ink">
              {c.label} <span className="text-ink-soft">· {EXCHANGE_PROVIDER_LABELS[c.provider]}</span>
            </p>
            <p className="text-xs text-ink-soft">
              {c.apiKeyMasked} · {c.verifiedPermissionLevel === "UNVERIFIED" ? "izin doğrulanmadı" : c.verifiedPermissionLevel}
              {c.syncStatus === "SYNCING" && " · senkronize ediliyor…"}
              {c.lastSyncError && ` · hata: ${c.lastSyncError}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => withBusy(c.id, () => verifyExchangeConnection(c.id))}
              disabled={busyId === c.id}
              className="rounded-full border border-gold/30 px-3 py-1 text-xs font-semibold text-ink hover:bg-parchment disabled:opacity-60"
            >
              İzni doğrula
            </button>
            <button
              onClick={() => withBusy(c.id, () => syncExchangeConnection(c.id))}
              disabled={busyId === c.id}
              className="rounded-full border border-gold/30 px-3 py-1 text-xs font-semibold text-ink hover:bg-parchment disabled:opacity-60"
            >
              Senkronize et
            </button>
            <button
              onClick={() => withBusy(c.id, () => removeExchangeConnection(c.id))}
              disabled={busyId === c.id}
              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Kaldır
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function WalletAddressForm({ onAdded }: { onAdded: () => void }) {
  const [chain, setChain] = useState<WalletChain>("ETHEREUM");
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await addWalletAddress({ chain, address, label: label || undefined });
      setAddress("");
      setLabel("");
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Cüzdan eklenemedi.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <FieldLabel>Zincir</FieldLabel>
        <select
          value={chain}
          onChange={(e) => setChain(e.target.value as WalletChain)}
          className={inputClass}
        >
          {Object.entries(WALLET_CHAIN_LABELS).map(([value, name]) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <FieldLabel>Cüzdan adresi</FieldLabel>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          minLength={10}
          maxLength={120}
          className={inputClass}
        />
      </div>
      <div>
        <FieldLabel>Etiket (opsiyonel)</FieldLabel>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          maxLength={60}
          className={inputClass}
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
      >
        {submitting ? "Ekleniyor…" : "Cüzdanı ekle"}
      </button>
    </form>
  );
}

function WalletAddressList({
  wallets,
  onChanged,
}: {
  wallets: WalletAddress[];
  onChanged: () => void;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);

  async function withBusy(id: string, fn: () => Promise<unknown>) {
    setBusyId(id);
    try {
      await fn();
      onChanged();
    } catch {
      // liste eski haliyle kalir
    } finally {
      setBusyId(null);
    }
  }

  if (wallets.length === 0) {
    return <p className="text-sm text-ink-soft">Henüz eklenmiş cüzdanın yok.</p>;
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {wallets.map((w) => (
        <li
          key={w.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gold/15 bg-cream px-3.5 py-2.5 text-sm"
        >
          <div>
            <p className="font-medium text-ink">
              {w.label ?? WALLET_CHAIN_LABELS[w.chain]}{" "}
              <span className="text-ink-soft">· {WALLET_CHAIN_LABELS[w.chain]}</span>
            </p>
            <p className="text-xs text-ink-soft">
              {w.address.length > 16
                ? `${w.address.slice(0, 8)}…${w.address.slice(-6)}`
                : w.address}
              {w.lastSyncError && ` · hata: ${w.lastSyncError}`}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => withBusy(w.id, () => syncWalletAddress(w.id))}
              disabled={busyId === w.id}
              className="rounded-full border border-gold/30 px-3 py-1 text-xs font-semibold text-ink hover:bg-parchment disabled:opacity-60"
            >
              Senkronize et
            </button>
            <button
              onClick={() => withBusy(w.id, () => removeWalletAddress(w.id))}
              disabled={busyId === w.id}
              className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
            >
              Kaldır
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function CsvImportForm({ onAdded }: { onAdded: () => void }) {
  const [exchangeName, setExchangeName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Lütfen bir CSV dosyası seç.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await importCsv(exchangeName, file);
      setSuccess("CSV içe aktarıldı.");
      setFile(null);
      setExchangeName("");
      onAdded();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "CSV içe aktarılamadı.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div>
        <FieldLabel>Borsa adı</FieldLabel>
        <input
          value={exchangeName}
          onChange={(e) => setExchangeName(e.target.value)}
          required
          placeholder="ör. Binance, BTCTurk…"
          className={inputClass}
        />
      </div>
      <div>
        <FieldLabel>CSV dosyası</FieldLabel>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1.5 w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-marble-dark file:px-4 file:py-2 file:text-xs file:font-semibold file:text-cream"
        />
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {success && <p className="text-sm text-emerald-700">{success}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="mt-1 rounded-full bg-marble-dark px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-marble-dark-2 disabled:opacity-60"
      >
        {submitting ? "Yükleniyor…" : "CSV yükle"}
      </button>
    </form>
  );
}

export function SourceConnections({ onSourcesChanged }: { onSourcesChanged: () => void }) {
  const [tab, setTab] = useState<Tab>("exchange");
  const [connections, setConnections] = useState<ExchangeConnection[]>([]);
  const [wallets, setWallets] = useState<WalletAddress[]>([]);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    try {
      const [c, w] = await Promise.all([
        listExchangeConnections(),
        listWalletAddresses(),
      ]);
      setConnections(c);
      setWallets(w);
    } catch {
      // panel ustundeki genel hata zaten dashboard verisi icin gosteriliyor
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChanged() {
    reload();
    onSourcesChanged();
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-marble-dark text-cream"
                : "border border-gold/25 text-ink-soft hover:bg-parchment"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          {tab === "exchange" && <ExchangeConnectionForm onAdded={handleChanged} />}
          {tab === "wallet" && <WalletAddressForm onAdded={handleChanged} />}
          {tab === "csv" && <CsvImportForm onAdded={handleChanged} />}
        </Card>
        <Card>
          <p className="mb-3 text-xs font-semibold tracking-wide text-ink-soft uppercase">
            Bağlı {tab === "exchange" ? "borsa hesapları" : tab === "wallet" ? "cüzdanlar" : "kaynaklar"}
          </p>
          {loading ? (
            <p className="text-sm text-ink-soft">Yükleniyor…</p>
          ) : tab === "exchange" ? (
            <ExchangeConnectionList connections={connections} onChanged={handleChanged} />
          ) : tab === "wallet" ? (
            <WalletAddressList wallets={wallets} onChanged={handleChanged} />
          ) : (
            <p className="text-sm text-ink-soft">
              Yüklediğin CSV dosyaları işlendikten sonra doğrudan pozisyon ve
              işlem verine eklenir, ayrıca listelenmez.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
