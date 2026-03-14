import { MetaProvider, Title } from "@solidjs/meta";
import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import NavBar from "~/components/navbar/NavBar";
import Footer from "./components/footer/FooterSection";
import "./app.css";

function Layout(props: { children: any }) {
  const location = useLocation();
  const hideLayout = location.pathname.startsWith("/admin");

  return (
    <MetaProvider>
      <Title>The Waterfront Beach Resort</Title>
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