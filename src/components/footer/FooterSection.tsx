export default function Footer() {
  return (
    <footer class="bg-[var(--color-accent-1)] text-white py-12">
      <div class="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">

        <div>
          <h3 class="font-semibold mb-2">Contact</h3>
          <p>Hotel Address, Resort Grounds</p>
          <p>Morong, Bataan</p>
        </div>

        <div>
          <h3 class="font-semibold mb-2">Connect</h3>
          <div class="flex gap-4">
            <span>Facebook</span>
            <span>Instagram</span>
            <span>Twitter</span>
          </div>
        </div>

        <div class="md:text-right">
          <p>Copyright © 2025</p>
        </div>

      </div>
    </footer>
  );
}