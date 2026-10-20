export default function JsonLdTravelAgency() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Frecuencia Sur Ushuaia",
    url: "https://www.frecuenciasurushuaia.com",
    logo: "https://www.frecuenciasurushuaia.com/images/logo/logo.png",
    telephone: "+54 9 2901 48-9265",
    email: "frecuenciasurushuaia@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ushuaia",
      addressRegion: "Tierra del Fuego",
      addressCountry: "AR",
    },
    sameAs: [
      "https://instagram.com/frecuenciasur.ushuaia",
      "https://tiktok.com/@frecuenciasur.ushuaia",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
