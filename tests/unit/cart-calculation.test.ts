import { describe, it, expect } from "vitest";
import { SHIPPING_COST, FREE_SHIPPING_THRESHOLD } from "@/lib/utils";

describe("Cart Calculations", () => {
  it("should calculate subtotal correctly", () => {
    const items = [
      { price: 850000, quantity: 2 },
      { price: 1200000, quantity: 1 },
    ];
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    expect(subtotal).toBe(2900000);
  });

  it("should apply free shipping for orders above threshold", () => {
    const subtotal = 2500000;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    expect(shipping).toBe(0);
  });

  it("should charge shipping for orders below threshold", () => {
    const subtotal = 500000;
    const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    expect(shipping).toBe(SHIPPING_COST);
  });

  it("should calculate total with shipping", () => {
    const subtotal = 500000;
    const shipping = SHIPPING_COST;
    const total = subtotal + shipping;
    expect(total).toBe(subtotal + SHIPPING_COST);
  });
});

describe("Discount Calculations", () => {
  it("should calculate percentage discount", () => {
    const subtotal = 1000000;
    const discountPercent = 10;
    const discount = Math.round(subtotal * discountPercent / 100);
    expect(discount).toBe(100000);
  });

  it("should cap discount at maxDiscount", () => {
    const subtotal = 5000000;
    const discountPercent = 10;
    const maxDiscount = 200000;
    let discount = Math.round(subtotal * discountPercent / 100);
    if (discount > maxDiscount) discount = maxDiscount;
    expect(discount).toBe(200000);
  });

  it("should apply fixed amount discount", () => {
    const subtotal = 800000;
    const discountAmount = 50000;
    const total = subtotal - discountAmount;
    expect(total).toBe(750000);
  });
});

describe("Stock Validation", () => {
  it("should not allow quantity exceeding stock", () => {
    const stock = 5;
    const requestedQuantity = 7;
    expect(requestedQuantity <= stock).toBe(false);
  });

  it("should allow quantity within stock", () => {
    const stock = 10;
    const requestedQuantity = 3;
    expect(requestedQuantity <= stock).toBe(true);
  });

  it("should detect out of stock", () => {
    const stock = 0;
    expect(stock > 0).toBe(false);
  });
});
