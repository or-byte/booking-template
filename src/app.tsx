import { Meta, MetaProvider, Title } from "@solidjs/meta";
import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import NavBar from "~/components/navbar/NavBar";
import Footer from "~/components/footer/FooterSection";
import { fullAddress, site } from "~/data/site";
import "./app.css";

function Layout(props: { children: any }) {
  const location = useLocation();
  // Admin routes are a separate product surface; they keep their own chrome.
  const hideLayout = location.pathname.includes("/admin");

  return (
    <MetaProvider>
      <Title>{site.name}</Title>
      <Meta name="description" content={site.description} />
      <Meta property="og:type" content="website" />
      <Meta property="og:site_name" content={site.name} />
      <Meta property="og:title" content={`${site.name} — ${site.tagline}`} />
      <Meta property="og:description" content={site.description} />
      <Meta property="og:image" content="/images/hero_img.jpg" />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="geo.placename" content={fullAddress} />

      {!hideLayout && <NavBar />}
      <Suspense>{props.children}</Suspense>
      {!hideLayout && <Footer />}
    </MetaProvider>
  );
}

export default function App() {
  return (
    <Router root={(props) => <Layout>{props.children}</Layout>}>
      <FileRoutes />
    </Router>
  );
}
