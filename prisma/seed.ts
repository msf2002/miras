import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.size.deleteMany();
  await prisma.color.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // ─── Users ──────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const customerPassword = await bcrypt.hash("customer123", 12);

  const admin = await prisma.user.create({
    data: {
      name: "مدیر سایت",
      email: "admin@mirasnoor.ir",
      hashedPassword: adminPassword,
      role: Role.ADMIN,
      phone: "09121234567",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "علی محمدی",
      email: "customer@example.com",
      hashedPassword: customerPassword,
      role: Role.CUSTOMER,
      phone: "09351234567",
    },
  });

  // Customer address
  await prisma.address.create({
    data: {
      userId: customer.id,
      title: "خانه",
      fullName: "علی محمدی",
      phone: "09351234567",
      province: "تهران",
      city: "تهران",
      address: "خیابان ولیعصر، نرسیده به میدان ونک، پلاک ۱۲۳، واحد ۵",
      postalCode: "1234567890",
      isDefault: true,
    },
  });

  // ─── Sizes ──────────────────────────────────────────
  const sizes = await Promise.all([
    prisma.size.create({ data: { name: "کوچک", order: 1 } }),
    prisma.size.create({ data: { name: "متوسط", order: 2 } }),
    prisma.size.create({ data: { name: "بزرگ", order: 3 } }),
    prisma.size.create({ data: { name: "خیلی بزرگ", order: 4 } }),
  ]);

  // ─── Colors ─────────────────────────────────────────
  const colors = await Promise.all([
    prisma.color.create({ data: { name: "طلایی", hex: "#C5A55A", order: 1 } }),
    prisma.color.create({ data: { name: "مشکی", hex: "#1A1A1A", order: 2 } }),
    prisma.color.create({ data: { name: "مسی", hex: "#B87333", order: 3 } }),
    prisma.color.create({ data: { name: "نقره‌ای", hex: "#C0C0C0", order: 4 } }),
  ]);

  // ─── Products ───────────────────────────────────────
  const productsData = [
    {
      name: "تندیس یا علی",
      slug: "tandis-ya-ali",
      description:
        "تندیس یا علی، اثری هنری و منحصربه‌فرد که با الهام از خوشنویسی اسلامی و هنر ایرانی طراحی شده است. این تندیس با دقت و ظرافت توسط هنرمندان ایرانی ساخته شده و نماد شجاعت و عدالت است.",
      story:
        "نام مبارک علی (ع)، نماد شجاعت، عدالت و حکمت در فرهنگ اسلامی است. این تندیس با الهام از هنر خوشنویسی نستعلیق و معماری اسلامی طراحی شده و تلاش دارد عظمت و زیبایی این نام مقدس را در قالب یک اثر هنری سه‌بعدی به تصویر بکشد. هر منحنی و هر خط در این اثر، روایتگر بخشی از تاریخ و فرهنگ غنی اسلامی است.",
      isFeatured: true,
      basePrice: 850000,
    },
    {
      name: "تندیس یا حسین",
      slug: "tandis-ya-hosein",
      description:
        "تندیس یا حسین، اثری نفیس که با الهام از عاشورا و فرهنگ حسینی طراحی شده است. این تندیس با استفاده از بهترین مواد اولیه و با دست هنرمندان ماهر ایرانی ساخته می‌شود.",
      story:
        "نام حسین (ع) همواره یادآور آزادگی، ایثار و مقاومت در برابر ظلم بوده است. این تندیس با الهام از هنر عاشورایی و خوشنویسی اسلامی طراحی شده و هر جزء آن حکایت از عشق و ارادت به سالار شهیدان دارد. ترکیب هنر سنتی ایرانی با طراحی مدرن، این اثر را به یادگاری ماندگار تبدیل کرده است.",
      isFeatured: true,
      basePrice: 920000,
    },
    {
      name: "تندیس محمد",
      slug: "tandis-mohammad",
      description:
        "تندیس محمد، اثری هنری بی‌نظیر که نام مبارک پیامبر اکرم (ص) را در قالب یک تندیس زیبا و با شکوه به تصویر کشیده است. ترکیبی از هنر خوشنویسی و مجسمه‌سازی مدرن.",
      story:
        "نام محمد (ص)، نام آخرین فرستاده خداوند و محبوب‌ترین نام در جهان اسلام است. این تندیس با الهام از هنر خوشنویسی قرن‌های گذشته و با بهره‌گیری از تکنیک‌های مدرن طراحی شده است. هدف از خلق این اثر، ایجاد حسی از آرامش و معنویت در فضای زندگی شماست.",
      isFeatured: true,
      basePrice: 780000,
    },
    {
      name: "تندیس یا مهدی",
      slug: "tandis-ya-mahdi",
      description:
        "تندیس یا مهدی، نمادی از امید و انتظار که با ظرافت و هنرمندی خاص طراحی و ساخته شده است. این تندیس انتخابی مناسب برای هدیه و تزئین فضای معنوی منزل شماست.",
      story:
        "نام مهدی (عج)، نماد امید، عدالت جهانی و پایان انتظار است. این تندیس با الهام از مفهوم انتظار و امید در فرهنگ شیعی طراحی شده و تلاش دارد حس صلح و آرامش را به بیننده منتقل کند. طراحی مینیمال و استفاده از خطوط منحنی، این اثر را به ترکیبی زیبا از سنت و مدرنیته تبدیل کرده است.",
      isFeatured: true,
      basePrice: 890000,
    },
  ];

  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        story: productData.story,
        isFeatured: productData.isFeatured,
        isActive: true,
        images: {
          create: [
            {
              url: `/images/products/${productData.slug}-1.jpg`,
              alt: productData.name,
              order: 0,
              isPrimary: true,
            },
            {
              url: `/images/products/${productData.slug}-2.jpg`,
              alt: `${productData.name} - نمای دوم`,
              order: 1,
            },
          ],
        },
      },
    });

    // Create variants for each size-color combination
    for (const size of sizes) {
      for (const color of colors) {
        const sizeMultiplier =
          size.name === "کوچک"
            ? 1
            : size.name === "متوسط"
              ? 1.4
              : size.name === "بزرگ"
                ? 1.9
                : 2.6;
        const colorMultiplier =
          color.name === "طلایی"
            ? 1.2
            : color.name === "نقره‌ای"
              ? 1.1
              : color.name === "مسی"
                ? 1.05
                : 1;

        const price = Math.round(
          productData.basePrice * sizeMultiplier * colorMultiplier / 1000
        ) * 1000;

        const stock = Math.floor(Math.random() * 15) + 1;

        const skuParts = [
          "MN",
          productData.slug.split("-").pop()?.substring(0, 3).toUpperCase(),
          size.name.substring(0, 2),
          color.name.substring(0, 2),
        ];

        await prisma.productVariant.create({
          data: {
            productId: product.id,
            sizeId: size.id,
            colorId: color.id,
            sku: skuParts.join("-"),
            price,
            stock,
            isActive: true,
          },
        });
      }
    }
  }

  // ─── Coupons ────────────────────────────────────────
  await prisma.coupon.create({
    data: {
      code: "WELCOME10",
      description: "۱۰٪ تخفیف خوش‌آمدگویی",
      discountPercent: 10,
      maxDiscount: 200000,
      minOrderAmount: 500000,
      maxUses: 100,
      isActive: true,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.coupon.create({
    data: {
      code: "NOOR50",
      description: "۵۰ هزار تومان تخفیف",
      discountAmount: 50000,
      minOrderAmount: 300000,
      maxUses: 50,
      isActive: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  // ─── Sample Reviews ─────────────────────────────────
  const products = await prisma.product.findMany();
  for (const product of products) {
    await prisma.review.create({
      data: {
        userId: customer.id,
        productId: product.id,
        rating: 4 + Math.floor(Math.random() * 2),
        comment: "تندیس بسیار زیبا و باکیفیت بود. بسته‌بندی عالی داشت و خیلی سریع رسید. پیشنهاد می‌کنم.",
        status: "APPROVED",
      },
    });
  }

  console.log("✅ Database seeded successfully!");
  console.log(`   Admin: admin@mirasnoor.ir / admin123`);
  console.log(`   Customer: customer@example.com / customer123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
