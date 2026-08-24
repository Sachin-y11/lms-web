# LMS

A modern learning management system for publishing structured courses, delivering focused learning experiences, and giving administrators a clear view of their platform.

The application brings course authoring, learner-facing discovery, rich lesson content, secure authentication, media uploads, and operational analytics into one focused workspace.

## What is included

- **Course authoring**: Create courses with descriptions, pricing, duration, difficulty, categories, chapters, and lessons.
- **Structured curriculum**: Reorder chapters and lessons with drag-and-drop interactions.
- **Rich lesson content**: Compose formatted learning material with TipTap.
- **Authentication**: Email/password, email verification, OTP, magic links, Google OAuth, passkeys, two-factor authentication, and account recovery through Better Auth.
- **Media management**: Upload course and lesson assets through UploadThing.
- **Admin workspace**: Review platform activity with dashboard cards, charts, tables, and course management tools.
- **Responsive interface**: Built with Tailwind CSS, shadcn/ui, and accessible component primitives.

## Technology

| Area                 | Technology                                 |
| -------------------- | ------------------------------------------ |
| Application          | Next.js 16, React 19, TypeScript           |
| UI                   | Tailwind CSS 4, shadcn/ui, Base UI, Lucide |
| Data                 | PostgreSQL, Prisma 7                       |
| Authentication       | Better Auth                                |
| Content              | TipTap                                     |
| Uploads              | UploadThing                                |
| Forms and validation | React Hook Form, Zod                       |

## Requirements

- Node.js 20 or newer
- pnpm
- A PostgreSQL database
- A Resend API key for transactional email
- Google OAuth credentials for Google sign-in

## Getting started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lms"
RESEND_API_KEY="re_..."
GOOGLE_CLIENT_ID="...apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="..."
```

Configure the Google OAuth callback for your environment at:

```text
http://localhost:3000/api/auth/callback/google
```

### 3. Prepare the database

Apply the Prisma migrations to your configured PostgreSQL database:

```bash
pnpm prisma migrate dev
```

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to visit the application.

## Commands

| Command          | Purpose                               |
| ---------------- | ------------------------------------- |
| `pnpm dev`       | Start the development server          |
| `pnpm build`     | Create a production build             |
| `pnpm start`     | Serve the production build            |
| `pnpm lint`      | Run ESLint                            |
| `pnpm typecheck` | Run TypeScript without emitting files |
| `pnpm format`    | Format TypeScript and TSX files       |

## Project structure

```text
app/          Routes, layouts, API handlers, and generated Prisma client
components/   Shared UI, authentication, editor, upload, and dashboard components
lib/          Authentication, Prisma, uploads, queries, and validation utilities
prisma/       PostgreSQL data model and migrations
public/       Static assets
```

## Data model

The core learning hierarchy is intentionally simple:

```text
Course
	└── Chapter
				└── Lesson
```

Courses support draft, published, and archived states. Chapters and lessons retain explicit positions so curriculum ordering remains predictable for authors and learners.

## Production checklist

- Use a managed PostgreSQL database and set `DATABASE_URL` to the production connection string.
- Configure a production Resend domain and replace the development sender in the authentication mailer.
- Register the production Google OAuth callback URL.
- Run `pnpm typecheck`, `pnpm lint`, and `pnpm build` before deployment.
- Keep `.env` files and provider credentials out of version control.

## License

This project is private and intended for internal or authorized use.
