// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#050d20" />
          <link rel="icon" href="/images/waterfront_logo.png" />
          <link rel="apple-touch-icon" href="/images/waterfront_logo.png" />

          {/*
            Two families carry the whole site: Cormorant Garamond for display
            (the high-contrast serif the brand mark already implies) and Inter
            for everything else. Loaded with `display=swap` so the first paint
            is never blocked by the network.
          */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
          />

          {/* Room photography is remote; warm the connection during hydration. */}
          <link rel="preconnect" href="https://images.unsplash.com" />

          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
