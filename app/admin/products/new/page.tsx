"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { adminCreateProduct } from "@/actions/admin";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminNewProductPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [story, setStory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = await adminCreateProduct({
        name,
        slug: slug || slugify(name),
        description,
        story,
        isActive: true,
        isFeatured: false,
      });
      if (result.error) toast.error(result.error);
      else {
        toast.success("محصول ایجاد شد");
        router.push("/admin/products");
      }
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-8">محصول جدید</h1>
      <div className="bg-white rounded-card shadow-card p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="نام محصول"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setSlug(slugify(e.target.value));
            }}
            required
          />
          <Input
            label="اسلاگ (URL)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            dir="ltr"
          />
          <Textarea
            label="توضیحات"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Textarea
            label="داستان و مفهوم اثر"
            value={story}
            onChange={(e) => setStory(e.target.value)}
          />
          <Button type="submit" isLoading={isPending}>
            ایجاد محصول
          </Button>
        </form>
      </div>
    </div>
  );
}
