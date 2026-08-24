import type { Metadata } from "next";
import { SITE_URL, SUPPORT_EMAIL, KVKK_EMAIL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "İletişim",
  description: "KriptoBeyan ile iletişime geçin — destek, iş birliği ve KVKK talepleri.",
  alternates: { canonical: `${SITE_URL}/iletisim` },
};

export default function IletisimPage() {
  return (
    <main className="bg-cream">
      <div className="mx-auto max-w-3xl px-6 py-16 lg:px-10 lg:py-24">
        <p className="text-xs font-semibold tracking-wide text-gold-deep uppercase">
          İletişim
        </p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
          Size nasıl yardımcı olabiliriz?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Ürünle ilgili sorularınız, teknik destek talepleriniz veya mali
          müşavir ortaklık başvurularınız için bize aşağıdaki kanallardan
          ulaşabilirsiniz.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-gold/20 bg-parchment p-6">
            <h2 className="text-sm font-semibold tracking-wide text-gold-deep uppercase">
              Genel destek
            </h2>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-3 block text-lg font-medium text-ink underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
            <p className="mt-2 text-sm text-ink-soft">
              Hesap, borsa bağlantısı ve fatura ile ilgili sorularınız için.
            </p>
          </div>

          <div className="rounded-2xl border border-gold/20 bg-parchment p-6">
            <h2 className="text-sm font-semibold tracking-wide text-gold-deep uppercase">
              KVKK talepleri
            </h2>
            <a
              href={`mailto:${KVKK_EMAIL}`}
              className="mt-3 block text-lg font-medium text-ink underline underline-offset-2"
            >
              {KVKK_EMAIL}
            </a>
            <p className="mt-2 text-sm text-ink-soft">
              Veri erişimi, düzeltme veya silme talepleri için KVKK
              Aydınlatma Metni&apos;ndeki prosedürü izleyin.
            </p>
          </div>
        </div>

        <p className="mt-10 text-sm text-ink-soft/80">
          Ortalama yanıt süresi 1-2 iş günüdür.
        </p>
      </div>
    </main>
  );
}
