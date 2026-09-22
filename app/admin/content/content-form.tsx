"use client";

import { useState, useTransition, useRef } from "react";
import {
  Save,
  Plus,
  X,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { updateSiteSetting } from "@/actions/settings";
import { toast } from "sonner";

// ─── انواع داده ────────────────────────────────────────
interface HomeData {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink: string;
    bannerUrl?: string;
  };
  features: { title: string; description: string }[];
  featured: { title: string; subtitle: string };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
  story: { title: string; paragraphs: string[] };
}

interface AboutData {
  title: string;
  paragraphs: string[];
}

interface GuideData {
  title: string;
  steps: string[];
}

interface ContactData {
  title: string;
  address: string;
  email: string;
  phone: string;
}

interface FooterData {
  about: string;
  quickLinks: { label: string; href: string }[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  copyright: string;
}

interface BrandingData {
  logoUrl: string;
}

interface Props {
  initialHome: HomeData;
  initialAbout: AboutData;
  initialGuide: GuideData;
  initialContact: ContactData;
  initialFooter: FooterData;
  initialBranding: BrandingData;
}

type TabKey = "home" | "about" | "guide" | "contact" | "footer" | "branding";

export function ContentForm({
  initialHome,
  initialAbout,
  initialGuide,
  initialContact,
  initialFooter,
  initialBranding,
}: Props) {
  const [tab, setTab] = useState<TabKey>("home");
  const [home, setHome] = useState<HomeData>(initialHome);
  const [about, setAbout] = useState<AboutData>(initialAbout);
  const [guide, setGuide] = useState<GuideData>(initialGuide);
  const [contact, setContact] = useState<ContactData>(initialContact);
  const [footer, setFooter] = useState<FooterData>(initialFooter);
  const [branding, setBranding] = useState<BrandingData>(initialBranding);
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    startTransition(async () => {
      try {
        if (tab === "home") await updateSiteSetting("home", home);
        if (tab === "about") await updateSiteSetting("about", about);
        if (tab === "guide") await updateSiteSetting("guide", guide);
        if (tab === "contact") await updateSiteSetting("contact", contact);
        if (tab === "footer") await updateSiteSetting("footer", footer);
        if (tab === "branding")
          await updateSiteSetting("branding", branding);
        toast.success("ذخیره شد");
      } catch {
        toast.error("خطا در ذخیره");
      }
    });
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "branding", label: "هویت بصری" },
    { key: "home", label: "صفحه اصلی" },
    { key: "about", label: "درباره ما" },
    { key: "guide", label: "راهنمای خرید" },
    { key: "contact", label: "تماس با ما" },
    { key: "footer", label: "فوتر" },
  ];

  return (
    <div className="bg-white rounded-card shadow-card">
      <div className="flex border-b border-warm-gray/10 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              tab === t.key
                ? "text-brand-green border-b-2 border-brand-green"
                : "text-warm-gray hover:text-brand-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6 space-y-6">
        {tab === "branding" && (
          <BrandingEditor data={branding} onChange={setBranding} />
        )}
        {tab === "home" && <HomeEditor data={home} onChange={setHome} />}
        {tab === "about" && <AboutEditor data={about} onChange={setAbout} />}
        {tab === "guide" && <GuideEditor data={guide} onChange={setGuide} />}
        {tab === "contact" && (
          <ContactEditor data={contact} onChange={setContact} />
        )}
        {tab === "footer" && (
          <FooterEditor data={footer} onChange={setFooter} />
        )}

        <div className="pt-4 border-t border-warm-gray/10">
          <button
            onClick={handleSave}
            disabled={isPending}
            className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-card hover:bg-brand-green/90 text-sm font-medium disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── کمک‌کننده‌ها ───────────────────────────────────────
function Field({
  label,
  value,
  onChange,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  dir?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={dir}
        className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none resize-y"
      />
    </div>
  );
}

function SectionBox({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-warm-gray/20 rounded-card p-4 space-y-3">
      <h3 className="font-bold text-sm text-brand-green">{title}</h3>
      {children}
    </div>
  );
}

// ─── ویرایشگر صفحه اصلی ────────────────────────────────
function HomeEditor({
  data,
  onChange,
}: {
  data: HomeData;
  onChange: (d: HomeData) => void;
}) {
  const updateHero = (k: keyof HomeData["hero"], v: string) =>
    onChange({ ...data, hero: { ...data.hero, [k]: v } });

  const updateFeature = (i: number, k: "title" | "description", v: string) => {
    const features = [...data.features];
    features[i] = { ...features[i], [k]: v };
    onChange({ ...data, features });
  };
  const addFeature = () =>
    onChange({
      ...data,
      features: [...data.features, { title: "", description: "" }],
    });
  const removeFeature = (i: number) =>
    onChange({
      ...data,
      features: data.features.filter((_, idx) => idx !== i),
    });

  const updateFeatured = (k: keyof HomeData["featured"], v: string) =>
    onChange({ ...data, featured: { ...data.featured, [k]: v } });

  const updateCta = (k: keyof HomeData["cta"], v: string) =>
    onChange({ ...data, cta: { ...data.cta, [k]: v } });

  const updateStoryTitle = (v: string) =>
    onChange({ ...data, story: { ...data.story, title: v } });
  const updateStoryParagraph = (i: number, v: string) => {
    const paragraphs = [...data.story.paragraphs];
    paragraphs[i] = v;
    onChange({ ...data, story: { ...data.story, paragraphs } });
  };
  const addStoryParagraph = () =>
    onChange({
      ...data,
      story: { ...data.story, paragraphs: [...data.story.paragraphs, ""] },
    });
  const removeStoryParagraph = (i: number) =>
    onChange({
      ...data,
      story: {
        ...data.story,
        paragraphs: data.story.paragraphs.filter((_, idx) => idx !== i),
      },
    });

  return (
    <div className="space-y-6">
      <SectionBox title="بنر بالای صفحه (Hero)">
        <Field
          label="عنوان اصلی"
          value={data.hero.title}
          onChange={(v) => updateHero("title", v)}
        />
        <Field
          label="زیرعنوان"
          value={data.hero.subtitle}
          onChange={(v) => updateHero("subtitle", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="متن دکمه"
            value={data.hero.ctaText}
            onChange={(v) => updateHero("ctaText", v)}
          />
          <Field
            label="لینک دکمه"
            value={data.hero.ctaLink}
            onChange={(v) => updateHero("ctaLink", v)}
            dir="ltr"
          />
        </div>

        {/* ✅ فیلد آپلود بنر */}
        <div className="border-t border-warm-gray/10 pt-4 mt-4">
          <HeroBannerUploader
            value={data.hero.bannerUrl || ""}
            onChange={(url) => updateHero("bannerUrl", url)}
          />
        </div>
      </SectionBox>

      <SectionBox title="ویژگی‌ها">
        <div className="space-y-3">
          {data.features.map((f, i) => (
            <div
              key={i}
              className="flex gap-2 items-start bg-beige/30 p-3 rounded-card"
            >
              <div className="flex-1 space-y-2">
                <input
                  value={f.title}
                  onChange={(e) => updateFeature(i, "title", e.target.value)}
                  placeholder="عنوان"
                  className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
                />
                <textarea
                  value={f.description}
                  onChange={(e) =>
                    updateFeature(i, "description", e.target.value)
                  }
                  placeholder="توضیحات"
                  rows={2}
                  className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm resize-y"
                />
              </div>
              <button
                type="button"
                onClick={() => removeFeature(i)}
                className="p-2 hover:bg-red-50 rounded"
                title="حذف"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFeature}
          className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
        >
          <Plus className="h-4 w-4" />
          افزودن ویژگی
        </button>
      </SectionBox>

      <SectionBox title="بخش محصولات محبوب">
        <Field
          label="عنوان"
          value={data.featured.title}
          onChange={(v) => updateFeatured("title", v)}
        />
        <Field
          label="زیرعنوان"
          value={data.featured.subtitle}
          onChange={(v) => updateFeatured("subtitle", v)}
        />
      </SectionBox>

      <SectionBox title="بنر سبز (CTA)">
        <Field
          label="عنوان"
          value={data.cta.title}
          onChange={(v) => updateCta("title", v)}
        />
        <TextArea
          label="توضیحات"
          value={data.cta.description}
          onChange={(v) => updateCta("description", v)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="متن دکمه"
            value={data.cta.buttonText}
            onChange={(v) => updateCta("buttonText", v)}
          />
          <Field
            label="لینک دکمه"
            value={data.cta.buttonLink}
            onChange={(v) => updateCta("buttonLink", v)}
            dir="ltr"
          />
        </div>
      </SectionBox>

      <SectionBox title="بخش داستان">
        <Field
          label="عنوان"
          value={data.story.title}
          onChange={updateStoryTitle}
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium">پاراگراف‌ها</label>
          {data.story.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={p}
                onChange={(e) => updateStoryParagraph(i, e.target.value)}
                rows={3}
                className="flex-1 rounded-card border border-warm-gray/30 px-3 py-2 text-sm resize-y"
              />
              <button
                type="button"
                onClick={() => removeStoryParagraph(i)}
                className="p-2 hover:bg-red-50 rounded self-start"
                title="حذف"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStoryParagraph}
            className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
          >
            <Plus className="h-4 w-4" />
            افزودن پاراگراف
          </button>
        </div>
      </SectionBox>
    </div>
  );
}

// ─── ویرایشگر درباره ما ────────────────────────────────
function AboutEditor({
  data,
  onChange,
}: {
  data: AboutData;
  onChange: (d: AboutData) => void;
}) {
  const updateParagraph = (i: number, val: string) => {
    const paragraphs = [...data.paragraphs];
    paragraphs[i] = val;
    onChange({ ...data, paragraphs });
  };

  return (
    <div className="space-y-4">
      <Field
        label="عنوان"
        value={data.title}
        onChange={(v) => onChange({ ...data, title: v })}
      />
      <div>
        <label className="block text-sm font-medium mb-2">پاراگراف‌ها</label>
        <div className="space-y-3">
          {data.paragraphs.map((p, i) => (
            <div key={i} className="flex gap-2">
              <textarea
                value={p}
                onChange={(e) => updateParagraph(i, e.target.value)}
                rows={3}
                className="flex-1 rounded-card border border-warm-gray/30 px-3 py-2 text-sm resize-y"
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    paragraphs: data.paragraphs.filter((_, idx) => idx !== i),
                  })
                }
                className="p-2 hover:bg-red-50 rounded self-start"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            onChange({ ...data, paragraphs: [...data.paragraphs, ""] })
          }
          className="mt-3 inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
        >
          <Plus className="h-4 w-4" />
          افزودن پاراگراف
        </button>
      </div>
    </div>
  );
}

// ─── ویرایشگر راهنمای خرید ─────────────────────────────
function GuideEditor({
  data,
  onChange,
}: {
  data: GuideData;
  onChange: (d: GuideData) => void;
}) {
  const updateStep = (i: number, val: string) => {
    const steps = [...data.steps];
    steps[i] = val;
    onChange({ ...data, steps });
  };

  return (
    <div className="space-y-4">
      <Field
        label="عنوان"
        value={data.title}
        onChange={(v) => onChange({ ...data, title: v })}
      />
      <div>
        <label className="block text-sm font-medium mb-2">مراحل</label>
        <div className="space-y-2">
          {data.steps.map((s, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-xs text-warm-gray w-6">{i + 1}.</span>
              <input
                value={s}
                onChange={(e) => updateStep(i, e.target.value)}
                className="flex-1 rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...data,
                    steps: data.steps.filter((_, idx) => idx !== i),
                  })
                }
                className="p-2 hover:bg-red-50 rounded"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...data, steps: [...data.steps, ""] })}
          className="mt-3 inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
        >
          <Plus className="h-4 w-4" />
          افزودن مرحله
        </button>
      </div>
    </div>
  );
}

// ─── ویرایشگر تماس با ما ───────────────────────────────
function ContactEditor({
  data,
  onChange,
}: {
  data: ContactData;
  onChange: (d: ContactData) => void;
}) {
  return (
    <div className="space-y-4">
      <Field
        label="عنوان"
        value={data.title}
        onChange={(v) => onChange({ ...data, title: v })}
      />
      <Field
        label="آدرس"
        value={data.address}
        onChange={(v) => onChange({ ...data, address: v })}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="ایمیل"
          value={data.email}
          onChange={(v) => onChange({ ...data, email: v })}
          dir="ltr"
        />
        <Field
          label="تلفن"
          value={data.phone}
          onChange={(v) => onChange({ ...data, phone: v })}
          dir="ltr"
        />
      </div>
    </div>
  );
}

// ─── ویرایشگر فوتر ─────────────────────────────────────
function FooterEditor({
  data,
  onChange,
}: {
  data: FooterData;
  onChange: (d: FooterData) => void;
}) {
  const updateQuickLink = (i: number, k: "label" | "href", v: string) => {
    const quickLinks = [...data.quickLinks];
    quickLinks[i] = { ...quickLinks[i], [k]: v };
    onChange({ ...data, quickLinks });
  };

  const addQuickLink = () =>
    onChange({
      ...data,
      quickLinks: [...data.quickLinks, { label: "", href: "" }],
    });

  const removeQuickLink = (i: number) =>
    onChange({
      ...data,
      quickLinks: data.quickLinks.filter((_, idx) => idx !== i),
    });

  return (
    <div className="space-y-6">
      <SectionBox title="متن معرفی کوتاه">
        <TextArea
          label=""
          value={data.about}
          onChange={(v) => onChange({ ...data, about: v })}
          rows={3}
        />
      </SectionBox>

      <SectionBox title="دسترسی سریع">
        <div className="space-y-3">
          {data.quickLinks.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                value={link.label}
                onChange={(e) => updateQuickLink(i, "label", e.target.value)}
                placeholder="عنوان"
                className="flex-1 rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
              />
              <input
                value={link.href}
                onChange={(e) => updateQuickLink(i, "href", e.target.value)}
                placeholder="/path"
                dir="ltr"
                className="flex-1 rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => removeQuickLink(i)}
                className="p-2 hover:bg-red-50 rounded"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addQuickLink}
          className="inline-flex items-center gap-1 text-sm text-brand-green hover:underline"
        >
          <Plus className="h-4 w-4" />
          افزودن لینک
        </button>
      </SectionBox>

      <SectionBox title="اطلاعات تماس">
        <Field
          label="تلفن"
          value={data.contact.phone}
          onChange={(v) =>
            onChange({
              ...data,
              contact: { ...data.contact, phone: v },
            })
          }
          dir="ltr"
        />
        <Field
          label="ایمیل"
          value={data.contact.email}
          onChange={(v) =>
            onChange({
              ...data,
              contact: { ...data.contact, email: v },
            })
          }
          dir="ltr"
        />
        <Field
          label="آدرس"
          value={data.contact.address}
          onChange={(v) =>
            onChange({
              ...data,
              contact: { ...data.contact, address: v },
            })
          }
        />
      </SectionBox>

      <SectionBox title="متن کپی‌رایت">
        <TextArea
          label=""
          value={data.copyright}
          onChange={(v) => onChange({ ...data, copyright: v })}
          rows={1}
        />
      </SectionBox>
    </div>
  );
}

// ─── ویرایشگر هویت بصری (لوگو) ─────────────────────────
function BrandingEditor({
  data,
  onChange,
}: {
  data: BrandingData | undefined;
  onChange: (d: BrandingData) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const safeData: BrandingData = data ?? { logoUrl: "/logo.png" };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "خطا در آپلود لوگو");
        return;
      }

      onChange({ ...safeData, logoUrl: result.url });
      toast.success("لوگو آپلود شد. برای اعمال، دکمه «ذخیره تغییرات» را بزنید.");
    } catch {
      toast.error("خطا در آپلود");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <SectionBox title="لوگوی سایت">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex-shrink-0">
          <p className="text-sm font-medium mb-2">پیش‌نمایش:</p>
          <div className="h-24 w-24 rounded-card border-2 border-dashed border-warm-gray/30 bg-beige/30 flex items-center justify-center overflow-hidden">
            {safeData.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={safeData.logoUrl}
                alt="لوگو"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <span className="text-xs text-warm-gray">بدون لوگو</span>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">
              آدرس لوگو
            </label>
            <input
              value={safeData.logoUrl}
              onChange={(e) =>
                onChange({ ...safeData, logoUrl: e.target.value })
              }
              dir="ltr"
              placeholder="/logo.png"
              className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm focus:border-brand-green focus:outline-none"
            />
            <p className="text-xs text-warm-gray mt-1">
              می‌توانید آدرس را دستی وارد کنید یا فایل جدید آپلود کنید.
            </p>
          </div>

          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-card hover:bg-brand-green/90 transition-colors text-sm font-medium disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "در حال آپلود..." : "آپلود لوگوی جدید"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleUpload}
            className="hidden"
          />

          <p className="text-xs text-warm-gray">
            فرمت‌های مجاز: PNG، JPG، SVG، WebP — حداکثر ۵ مگابایت
          </p>
        </div>
      </div>
    </SectionBox>
  );
}

// ─── آپلودر بنر Hero ────────────────────────────────────
function HeroBannerUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "خطا در آپلود بنر");
        return;
      }

      onChange(result.url);
      toast.success("بنر آپلود شد. برای اعمال، «ذخیره تغییرات» را بزنید.");
    } catch {
      toast.error("خطا در آپلود");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        تصویر بنر (Hero Banner)
      </label>

      {value ? (
        <div className="relative w-full h-40 rounded-card overflow-hidden border border-warm-gray/20 bg-beige/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="بنر"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            title="حذف بنر"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="w-full h-40 rounded-card border-2 border-dashed border-warm-gray/30 bg-beige/30 flex flex-col items-center justify-center text-warm-gray">
          <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
          <p className="text-xs">هنوز بنری آپلود نشده</p>
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-card hover:bg-brand-green/90 transition-colors text-sm font-medium disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          {uploading ? "در حال آپلود..." : value ? "تغییر بنر" : "آپلود بنر"}
        </button>
        <p className="text-xs text-warm-gray">
          توصیه: ۱۹۲۰×۶۰۰ پیکسل، حداکثر ۱۰ مگابایت
        </p>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}