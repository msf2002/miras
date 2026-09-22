"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Pencil, Power, PowerOff, Loader2, Trash2 } from "lucide-react";
import {
  adminCreateVariant,
  adminUpdateVariant,
  adminDeleteVariant,
} from "@/actions/admin";
import { formatPrice, generateSKU } from "@/lib/utils";
import { toast } from "sonner";

interface Variant {
  id: string;
  sizeId: string;
  colorId: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  size: { id: string; name: string; order: number };
  color: { id: string; name: string; hex: string; order: number };
}

interface Props {
  productId: string;
  productName: string;
  variants: Variant[];
  sizes: { id: string; name: string; order: number }[];
  colors: { id: string; name: string; hex: string; order: number }[];
}

export function ProductVariants({
  productId,
  productName,
  variants,
  sizes,
  colors,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [form, setForm] = useState({
    sizeId: sizes[0]?.id || "",
    colorId: colors[0]?.id || "",
    sku: "",
    price: "",
    stock: "",
  });

  const reset = () => {
    setForm({
      sizeId: sizes[0]?.id || "",
      colorId: colors[0]?.id || "",
      sku: "",
      price: "",
      stock: "",
    });
    setEditingId(null);
  };

  const openCreate = () => {
    reset();
    setOpen(true);
  };

  const openEdit = (v: Variant) => {
    setEditingId(v.id);
    setForm({
      sizeId: v.sizeId,
      colorId: v.colorId,
      sku: v.sku,
      price: v.price.toString(),
      stock: v.stock.toString(),
    });
    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sizeName = sizes.find((s) => s.id === form.sizeId)?.name || "";
      const colorName = colors.find((c) => c.id === form.colorId)?.name || "";

      const sku =
        form.sku.trim() || generateSKU(productName, sizeName, colorName);

      if (editingId) {
        const result = await adminUpdateVariant(editingId, {
          sku,
          price: Number(form.price),
          stock: Number(form.stock),
        });
        if (!result.success) { toast.error('خطا در ذخیره واریانت'); }        else {
          toast.success("واریانت ویرایش شد");
          setOpen(false);
          reset();
          router.refresh();
        }
      } else {
        const result = await adminCreateVariant({
          productId,
          sizeId: form.sizeId,
          colorId: form.colorId,
          sku,
          price: Number(form.price),
          stock: Number(form.stock),
        });
        if (result?.error) toast.error(result.error);
        else {
          toast.success("واریانت اضافه شد");
          setOpen(false);
          reset();
          router.refresh();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (variantId: string, currentActive: boolean) => {
    const action = currentActive ? "غیرفعال" : "فعال";
    if (!confirm(`این واریانت ${action} شود؟`)) return;

    setBusyId(variantId);
    try {
      await adminUpdateVariant(variantId, { isActive: !currentActive });
      toast.success(`واریانت ${action} شد`);
      router.refresh();
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (variantId: string, label: string) => {
    if (
      !confirm(
        `آیا از حذف کامل واریانت «${label}» مطمئن هستید؟\n\nاین عمل قابل بازگشت نیست.`
      )
    )
      return;

    setBusyId(variantId);
    try {
      const result = await adminDeleteVariant(variantId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("واریانت حذف شد");
        router.refresh();
      }
    } catch {
      toast.error("خطا در حذف واریانت");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-brand-black">
          واریانت‌ها ({variants.length})
        </h2>
        <button
          type="button"
          onClick={openCreate}
          disabled={sizes.length === 0 || colors.length === 0}
          className="inline-flex items-center gap-2 bg-brand-green text-white px-4 py-2 rounded-card hover:bg-brand-green/90 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          افزودن واریانت
        </button>
      </div>

      {sizes.length === 0 || colors.length === 0 ? (
        <p className="text-sm text-red-500 py-4">
          ابتدا باید سایز و رنگ در دیتابیس ثبت شده باشند.
        </p>
      ) : variants.length === 0 ? (
        <p className="text-sm text-warm-gray py-8 text-center">
          هنوز واریانتی ثبت نشده است
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-warm-gray/10 bg-beige/50">
                <th className="px-4 py-3 text-right font-medium text-warm-gray">
                  سایز
                </th>
                <th className="px-4 py-3 text-right font-medium text-warm-gray">
                  رنگ
                </th>
                <th className="px-4 py-3 text-right font-medium text-warm-gray">
                  SKU
                </th>
                <th className="px-4 py-3 text-right font-medium text-warm-gray">
                  قیمت
                </th>
                <th className="px-4 py-3 text-right font-medium text-warm-gray">
                  موجودی
                </th>
                <th className="px-4 py-3 text-right font-medium text-warm-gray">
                  وضعیت
                </th>
                <th className="px-4 py-3 text-right font-medium text-warm-gray">
                  عملیات
                </th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id} className="border-b border-warm-gray/5">
                  <td className="px-4 py-3">{v.size.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-4 w-4 rounded-full border border-warm-gray/20"
                        style={{ backgroundColor: v.color.hex }}
                      />
                      {v.color.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{v.sku}</td>
                  <td className="px-4 py-3">{formatPrice(v.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={v.stock <= 3 ? "text-red-500 font-bold" : ""}
                    >
                      {v.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-0.5 rounded-full text-xs ${
                        v.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {v.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => openEdit(v)}
                        disabled={busyId === v.id}
                        className="p-1.5 hover:bg-beige rounded transition-colors disabled:opacity-50"
                        title="ویرایش"
                      >
                        <Pencil className="h-4 w-4 text-warm-gray" />
                      </button>

                      {/* Toggle Active */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(v.id, v.isActive)}
                        disabled={busyId === v.id}
                        className={`p-1.5 rounded transition-colors disabled:opacity-50 ${
                          v.isActive ? "hover:bg-red-50" : "hover:bg-green-50"
                        }`}
                        title={v.isActive ? "غیرفعال کردن" : "فعال کردن"}
                      >
                        {busyId === v.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-warm-gray" />
                        ) : v.isActive ? (
                          <PowerOff className="h-4 w-4 text-red-500" />
                        ) : (
                          <Power className="h-4 w-4 text-green-600" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(v.id, `${v.size.name} - ${v.color.name}`)
                        }
                        disabled={busyId === v.id}
                        className="p-1.5 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        title="حذف کامل"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-card shadow-card-hover w-full max-w-md p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-brand-black">
                {editingId ? "ویرایش واریانت" : "واریانت جدید"}
              </h3>
              <button
                onClick={() => {
                  setOpen(false);
                  reset();
                }}
                className="p-1 hover:bg-beige rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingId && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      سایز *
                    </label>
                    <select
                      value={form.sizeId}
                      onChange={(e) =>
                        setForm({ ...form, sizeId: e.target.value })
                      }
                      className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
                      required
                    >
                      {sizes.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      رنگ *
                    </label>
                    <select
                      value={form.colorId}
                      onChange={(e) =>
                        setForm({ ...form, colorId: e.target.value })
                      }
                      className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
                      required
                    >
                      {colors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">
                  SKU (اختیاری)
                </label>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  placeholder="خالی بذاری خودکار ساخته می‌شه"
                  className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    قیمت (تومان) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    موجودی *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full rounded-card border border-warm-gray/30 px-3 py-2 text-sm"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-brand-green text-white px-4 py-2 rounded-card hover:bg-brand-green/90 transition-colors text-sm font-medium disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "ذخیره" : "افزودن"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    reset();
                  }}
                  className="px-4 py-2 rounded-card bg-beige text-warm-gray hover:bg-beige/70 text-sm font-medium"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}