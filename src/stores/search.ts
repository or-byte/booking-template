import { createSignal, createMemo, createResource } from "solid-js";
import { Package, getAllPackages } from "~/lib/package";

const [query, setQuery] = createSignal("");
// Fetch packages globally
const [packagesResource] = createResource<Package[]>(() => getAllPackages());
const [selectedPackage, setSelectedPackage] = createSignal<Package | null>(null);

const results = createMemo(() => {
  const q = query().toLowerCase();
  const pkgs = packagesResource() ?? [];
  if (!q) return [];
  return pkgs.filter(p =>
    p.description.toLowerCase().includes(q)
  );
});

export const search = {
  query,
  setQuery,
  results,
  selectedPackage,
  setSelectedPackage,
};