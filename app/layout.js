export const metadata = {
  title: "GuessVerse Party",
  description: "Juego estilo App Store",
  manifest: "/manifest.json",
  themeColor: "#0f0f0f"
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{margin:0, background:"#0f0f0f", color:"white"}}>
        {children}
      </body>
    </html>
  );
}
