"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { adminUpdateProduct } from "@/actions/admin";
import { toast } from "sonner";
import type {
  Product,
  ProductVariant,
  Size,
  Color,
  ProductImage,
} from "@prisma/client";

type ProductWithRelations = Product & {
  images: ProductImage[];
  variants: (ProductVariant & { size: Size; color: Color })[];
};

export function EditProductClient({
  product,
}: {
  product: ProductWithRelations;
}) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [story, setStory] = useState(product.story || "");
  const [isActive, setIsActive] = useState(product.isActive);
  const [isFeatured, setIsFeatured] = useState(product.isFeatured);

  const handleSave = () => {
    startTransition(async () => {
      const result = await adminUpdateProduct(product.id, {
        name,
        description,
        story,
        isActive,
        isFeatured,
      });
      if (result.success) toast.success("محصول به‌روزرسانی شد");
    });
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 max-w-2xl">
      <h2 className="font-bold text-brand-black mb-4">اطلاعات پایه</h2>
      <div className="space-y-4">
        <Input
          label="نام"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          label="توضیحات"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Textarea
          label="داستان"
          value={story}
          onChange={(e) => setStory(e.target.value)}
        />
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded text-brand-green"
            />
            فعال
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-brand-green"
            />
            ویژه
          </label>
        </div>
        <Button onClick={handleSave} isLoading={isPending}>
          ذخیره
        </Button>
      </div>
    </div>
  );
}