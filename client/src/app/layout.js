import "./globals.css";

export const metadata = {
  title: "শুভ নববর্ষ ১৪৩৩ | ICE বিভাগ পহেলা বৈশাখ স্টল",
  description: "আইসিই বিভাগের পহেলা বৈশাখ স্টলে স্বাগতম। সুস্বাদু খাবার, ঠান্ডা পানীয়, হ্যান্ডমেড পণ্য এবং আরও অনেক কিছু।",
  keywords: "পহেলা বৈশাখ, নববর্ষ, ICE, খাবার, বৈশাখী মেলা",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
