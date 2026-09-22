import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatNumber,
  generateOrderNumber,
  slugify,
  truncate,
  getInitials,
} from "@/lib/utils";

describe("formatPrice", () => {
  it("should format price with تومان", () => {
    const result = formatPrice(1500000);
    expect(result).toContain("تومان");
  });
});

describe("generateOrderNumber", () => {
  it("should start with MN-", () => {
    const orderNumber = generateOrderNumber();
    expect(orderNumber.startsWith("MN-")).toBe(true);
  });

  it("should generate unique numbers", () => {
    const a = generateOrderNumber();
    const b = generateOrderNumber();
    expect(a).not.toBe(b);
  });
});

describe("slugify", () => {
  it("should convert spaces to dashes", () => {
    expect(slugify("تندیس یا علی")).toBe("تندیس-یا-علی");
  });
});

describe("truncate", () => {
  it("should truncate long strings", () => {
    const result = truncate("این یک متن طولانی است", 10);
    expect(result.length).toBeLessThanOrEqual(13); // 10 + "..."
  });

  it("should not truncate short strings", () => {
    const result = truncate("کوتاه", 10);
    expect(result).toBe("کوتاه");
  });
});

describe("getInitials", () => {
  it("should get first letters", () => {
    expect(getInitials("علی محمدی")).toBe("عم");
  });
});
