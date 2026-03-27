import { createSignal, createMemo } from "solid-js";
import { getAllPackages, type Package } from "~/lib/package";

const [query, setQuery] = createSignal("");
const [selectedPackage, setSelectedPackage] = createSignal<Package | null>(null);
const [packages, setPackages] = createSignal<Package[]>([]);

// Fetch packages and store them
const loadPackages = async () => {
  const data = await getAllPackages();
  setPackages(data);
};

const results = createMemo(() => {
  const q = query().toLowerCase();
  if (!q) return [];
  return packages().filter(p => p.description.toLowerCase().includes(q));
});

export const search = {
  query,
  setQuery,
  results,
  selectedPackage,
  setSelectedPackage,
  loadPackages,
};