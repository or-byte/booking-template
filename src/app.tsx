import { MetaProvider, Title } from "@solidjs/meta";
import { Router, useLocation } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show } from "solid-js";
import NavBar from "~/components/navbar/NavBar";
import NavBarAdmin from "~/components/navbar/NavBarAdmin";
import Footer from "./components/footer/FooterSection";
import "./app.css";

function Layout(props: { children: any }) {
  const location = useLocation();
  // Admin routes will have the global navbar exluded
  const hideLayout = location.pathname.includes("/admin");

  return (
    <MetaProvider>
      <Title>The Waterfront Beach Resort</Title>
      <Show when={hideLayout} fallback={<NavBar />}>
        <NavBarAdmin />
      </Show>
      <Suspense>{props.children}</Suspense>
      <Show when={!hideLayout}>
        <Footer />
      </Show>
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