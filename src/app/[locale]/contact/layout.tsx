import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with oniii. We're here to help with your orders, products, and questions.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
