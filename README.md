# SolidStart

Everything you need to build a Solid project, powered by [`solid-start`](https://start.solidjs.com);

## Creating a project

```bash
# create a new project in the current directory
npm init solid@latest

# create a new project in my-app
npm init solid@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Database Workflow with Prisma
1. Schema updates
    - Modify `prisma/schema.prisma` as needed to cater to your feature
    - Commit changes to `schema.prisma`

2. Database sync
    - After making changes, run:
        `npx prisma migrate dev --name <meaningful-change>`
    - This will create a migration file and sync the database with the schema.

3. Client regeneration
    - Always regenerate the Prisma client after schema changes:
        `npx prisma generate`

> The `docker-compose.yml` is for local testing. You should also be able to use Prisma DB (see [Prisma Data Platform](https://console.prisma.io)). Make sure to match the `DATABASE_URL` with your database connection string.

4. Database Seeding
    - Modify the seed found in `prisma/seed.ts` as needed
    - After modifying, run: `npx prisma db seed`

## Building

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
