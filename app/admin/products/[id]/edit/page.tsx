import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { EditProductClient } from "./edit-client";
import { ProductImages } from "./product-images";
import { ProductVariants } from "./product-variants";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components

export default async function EditProductPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const [product, sizes, colors] = await Promise.all([
    db.product.findUnique({
      where: { id: params.id },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: {
          include: { size: true, color: true },
          orderBy: [{ size: { order: "asc" } }, { color: { order: "asc" } }],
        },
      },
    }),
    db.size.findMany({ orderBy: { order: "asc" } }),
    db.color.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-black mb-8">
        ویرایش: {product.name}
      </h1>

      {/* فرم اطلاعات پایه */}
      <EditProductClient product={product} />

      {/* گالری عکس */}
      <div className="mt-6">
        <ProductImages productId={product.id} images={product.images} />
      </div>

      {/* واریانت‌ها */}
      <ProductVariants
        productId={product.id}
        productName={product.name}
        variants={product.variants}
        sizes={sizes}
        colors={colors}
      />
    </div>
  );
}