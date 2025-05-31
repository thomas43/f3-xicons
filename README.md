This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

___
# f3-xicons

## Prisma commands

1. Importing seed data (should fix UTF-8 encoding weirdness)
```bash
$ npx ts-node prisma/seed/import-exicon.ts`
$ npx ts-node prisma/seed/import-lexicon.ts`
```

2. Fix UTF-8 encoding (if needed)
```bash
$ npx ts-node prisma/seed/fix-description-encoding.ts
```

3. Delete data **no safety**
```bash
$ npx ts-node prisma/seed/delete-exicon.ts
$ npx ts-node prisma/seed/delete-lexison.ts
```

4. Use [Prisma Studio](https://www.prisma.io/studio) (webpage for db entries): 
```bash
$ npx prisma studio
```

5. Reset db **will delete all data**
```bash
$ npx prisma migrate reset
```

6. Push/recreate after resetting
```bash
$ npx prisma db push --force-reset
```
7. `.env` needs to be 
```
DATABASE_URL="postgresql://USER:PASS@PUBLIC_IP:5432/f3xicons?sslmode=require"
```

## Tailwind debugging

1. See if it'll compile...
```bash
npx tailwindcss -i src/app/globals.css  -o out.css --watch
```

## Running: 
`$ npm run dev`
