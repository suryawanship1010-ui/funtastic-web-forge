

## Plan: Career Page, Navigation Fixes, UI Improvements

### 1. Career Page with Admin Job Management

**Database changes (migrations):**
- Create `job_posts` table: id, title, slug, department, location, type (full-time/part-time/contract), description, requirements, experience, salary_range, status (draft/published/closed), created_at, updated_at
- Create `job_applications` table: id, job_post_id (FK), applicant_name, email, phone, resume_url, cover_letter, status (new/reviewing/shortlisted/interviewed/offered/rejected/hired), notes, created_at, updated_at
- Add RLS policies: public can view published jobs, anyone can insert applications, admins can manage everything
- Create storage bucket `resumes` for resume uploads

**Frontend - Public career page (`src/pages/Careers.tsx`):**
- List published job openings with filters (department, location, type)
- Job detail view with apply form (name, email, phone, resume upload, cover letter)
- Header + Footer consistent with other pages

**Frontend - Admin panel:**
- Add "Careers" nav item to `AdminLayout.tsx`
- `src/pages/admin/JobPosts.tsx` — CRUD for job postings (create/edit/publish/close)
- `src/pages/admin/JobApplications.tsx` — View applications per job, change status (new → reviewing → shortlisted → interviewed → offered/rejected/hired), add notes, download resumes
- Pipeline/kanban-style view for hiring process

**Routes in App.tsx:**
- `/careers` — public careers page
- `/careers/:slug` — job detail + apply
- `/admin/careers` — admin job posts
- `/admin/careers/:id/applications` — applications for a specific job

### 2. Add Header/Navbar to Blog Pages (Back Navigation)

- Blog listing page (`Blog.tsx`) and blog post page (`BlogPost.tsx`) already have `<Header />` which includes the navbar
- Add a "Back to Blogs" button in `BlogPost.tsx` hero section (using `useNavigate(-1)` or Link to `/blog`)
- Add "Careers" link to the navbar in `Header.tsx` and `ServicePageHeader.tsx`

### 3. Service Cards Grid — 3 per Row

**File: `src/components/Services.tsx`**
- Change grid from `grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` to `grid md:grid-cols-2 lg:grid-cols-3` so we get 3 cards per row (2 rows of 3 for 6 services)

### 4. Address: "Office No." → "Flat No."

**Files: `src/components/Contact.tsx`, `src/components/Footer.tsx`**
- Replace "Office No. 1007" with "Flat No. 1007" in both files

### 5. Remove White Background from Logo

**Files: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/ServicePageHeader.tsx`, `src/components/Hero.tsx`**
- The logo is a `.jpg` file which inherently has a white background. Two approaches:
  - Option A: Add CSS `mix-blend-mode: multiply` and dark background handling to visually remove white background
  - Option B: Add `rounded` + clip styling to minimize the white border appearance
- Will use `mix-blend-mode: multiply` on light backgrounds and appropriate styling for dark backgrounds (footer) to blend the white away

### Technical Details

**New database tables:**
```text
job_posts
├── id (uuid, PK)
├── title (text)
├── slug (text, unique)
├── department (text)
├── location (text)
├── employment_type (text) — full-time, part-time, contract, internship
├── description (text) — rich text content
├── requirements (text)
├── experience (text)
├── salary_range (text, nullable)
├── status (text) — draft, published, closed
├── is_active (boolean)
├── created_at, updated_at

job_applications
├── id (uuid, PK)
├── job_post_id (uuid, FK → job_posts)
├── applicant_name (text)
├── email (text)
├── phone (text, nullable)
├── resume_url (text, nullable)
├── cover_letter (text, nullable)
├── status (text) — new, reviewing, shortlisted, interviewed, offered, rejected, hired
├── admin_notes (text, nullable)
├── created_at, updated_at
```

**Files to create:**
- `src/pages/Careers.tsx` — public job listings
- `src/pages/CareerDetail.tsx` — job detail + apply form
- `src/pages/admin/JobPosts.tsx` — admin job management
- `src/pages/admin/JobApplications.tsx` — application pipeline

**Files to modify:**
- `src/App.tsx` — add career routes
- `src/pages/admin/AdminLayout.tsx` — add Careers nav item
- `src/components/Header.tsx` — add Careers nav link, fix logo
- `src/components/ServicePageHeader.tsx` — add Careers nav link, fix logo
- `src/components/Footer.tsx` — fix address, fix logo
- `src/components/Contact.tsx` — fix address
- `src/components/Services.tsx` — fix grid to 3 columns
- `src/components/Hero.tsx` — fix logo
- `src/pages/BlogPost.tsx` — ensure back navigation exists

