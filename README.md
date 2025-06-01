Hosted [here](https://f3-xicons-2.fly.dev/)

Please read the home page of the app.

# Getting Started (locally)

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


# f3-xicons

Review the [f3_xicon hackathon doc](xicon_hackathon.md)

## Cleaning/Reseeding the DB (not recommended for prod...but it's fine...)
1. Delete the old data
```bash
$ npx ts-node prisma/seed/delete-xicon.ts
```

2. Import last-known best CSV
```bash
$ npx ts-node prisma/seed/import-xicons.ts
```

## Prisma commands

1. Importing seed data (should fix UTF-8 encoding weirdness)
```bash
$ npx ts-node prisma/seed/import-exicon.ts
$ npx ts-node prisma/seed/import-lexicon.ts
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
