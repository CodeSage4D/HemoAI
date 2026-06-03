# Vercel Deployment Guide - Blood Bank Intelligence SaaS

This document outlines the requirements and deployment instructions to publish the Next.js frontend of the Blood Bank Intelligence SaaS to Vercel.

## Environment Variables

To ensure the frontend successfully communicates with the production Node.js backend, configure the following environment variables in your Vercel Project Settings:

| Variable Name | Value Description | Example Value |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The public base URL of the production API gateway. | `https://api.hemoi.com` |

## Same-Origin Rewrites (Critical for HttpOnly Cookies)

Because modern web browsers block cross-origin cookies in third-party contexts, it is highly recommended to route backend API requests through Next.js rewrites. This maps `/api/*` requests on the frontend domain directly to the backend IP/domain on the server side, keeping cookie operations same-origin.

Ensure your `next.config.ts` or `next.config.js` has rewrite rules configured:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## Deployment Checklist

- [ ] **Node.js Runtime Version:** Vercel project settings set to use Node 20.x or 18.x.
- [ ] **Next Public Environment variables:** `NEXT_PUBLIC_API_URL` is set under Vercel configuration panel.
- [ ] **Clean local compile check:** Verify that `npm run build` completes successfully on local branch before merging to main.
- [ ] **Allowed CORS Origins:** Ensure the Vercel domain (`https://project-name.vercel.app`) is explicitly listed in the backend `.env` `CORS_ORIGIN` variable.
- [ ] **Database Connection:** Confirm database migrations ran successfully (`npx prisma migrate deploy`) on production PostgreSQL before testing application routes.
