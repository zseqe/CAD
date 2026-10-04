# CAD

Start: `npm install` then `npm run dev`.

## Add pictures and videos (no coding)
1. Run `npm run missing`. It prints the exact file names the website wants, e.g. `public/images/hero/campaign-01.jpg`.
   (While `npm run dev` is running, every empty picture spot also shows its file name on screen.)
2. Put your picture at that exact path. jpg, png or webp all work.
3. Refresh the browser. Done.

**More pictures on one product:** add `-02`, `-03`, `-04` files next to `-01` (same name, next number).

**Videos:** drop a `.mp4` with the same name as the picture slot, e.g. `public/images/hero/campaign-01.mp4`. It plays silently on loop in place of the picture (the picture is used while it loads). For product galleries add `jackie-shoulder-bag-03.mp4`. Keep videos under about 15 MB.

## Add a product / brand
Add one `P(...)` line in `src/data/products.ts` or one `b(...)` line in `src/data/brands.ts`, then add its pictures as above.

## Purchase flow
Mock checkout lives in `src/lib/commerce.ts` (swap the payment provider and order storage for Razorpay/Stripe/Supabase later).
