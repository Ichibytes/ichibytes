import "./global.css";

export const metadata = {
  title: "Ichibytes",
  description: "Personal website and blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
