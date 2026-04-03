export const metadata = {
  title: "GuessVerse Party",
  description: "Juego de fiesta para amigos y familia",
  manifest: "/manifest.json",
  themeColor: "#111827"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}