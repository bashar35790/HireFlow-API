import dotenv from "dotenv";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";

dotenv.config();

const SAMPLE_PASSWORD = "Pass@123";
const counts = {
  users: 0,
  categories: 0,
  companies: 0,
  jobs: 0,
  applications: 0,
  savedJobs: 0,
  reviews: 0,
};

async function upsertUser(data: {
  name: string;
  email: string;
  role: "JOB_SEEKER" | "EMPLOYER" | "ADMIN";
  passwordHash: string;
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) return existing;
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      role: data.role,
      password: data.passwordHash,
    },
  });
  counts.users++;
  return user;
}

async function upsertCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const existing = await prisma.category.findUnique({ where: { slug: data.slug } });
  if (existing) return existing;
  const category = await prisma.category.create({ data });
  counts.categories++;
  return category;
}

async function upsertCompany(data: {
  name: string;
  location: string;
  website: string;
  description: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  ownerId: string;
}) {
  const existing = await prisma.company.findFirst({
    where: { name: data.name, isDeleted: false },
  });
  if (existing) return existing;
  const company = await prisma.company.create({ data });
  counts.companies++;
  return company;
}

async function upsertJob(data: {
  title: string;
  description: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  jobType: string;
  experienceLevel: string;
  companyId: string;
  categoryId: string;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
}) {
  const existing = await prisma.job.findFirst({
    where: { title: data.title, companyId: data.companyId, isDeleted: false },
  });
  if (existing) return existing;
  const job = await prisma.job.create({ data });
  counts.jobs++;
  return job;
}

async function upsertApplication(data: {
  userId: string;
  jobId: string;
  resume?: string;
  coverLetter?: string;
  status: "PENDING" | "REVIEWING" | "SHORTLISTED" | "REJECTED" | "ACCEPTED";
}) {
  const existing = await prisma.application.findUnique({
    where: { userId_jobId: { userId: data.userId, jobId: data.jobId } },
  });
  if (existing) return existing;
  const application = await prisma.application.create({ data });
  counts.applications++;
  return application;
}

async function upsertSavedJob(userId: string, jobId: string) {
  const existing = await prisma.savedJob.findUnique({
    where: { userId_jobId: { userId, jobId } },
  });
  if (existing) return;
  await prisma.savedJob.create({ data: { userId, jobId } });
  counts.savedJobs++;
}

async function upsertReview(data: {
  userId: string;
  companyId: string;
  rating: number;
  comment: string;
}) {
  const existing = await prisma.review.findUnique({
    where: { userId_companyId: { userId: data.userId, companyId: data.companyId } },
  });
  if (existing) return;
  await prisma.review.create({ data });
  counts.reviews++;
}

async function main() {
  const passwordHash = await bcrypt.hash(SAMPLE_PASSWORD, 10);

  // ---- USERS (Admin, 2 Employers, 2 Seekers) ----
  const admin = await upsertUser({
    name: "HireFlow Admin",
    email: "admin@hireflow.io",
    role: "ADMIN",
    passwordHash,
  });
  const sarah = await upsertUser({
    name: "Sarah Ahmed",
    email: "sarah@acmecorp.com",
    role: "EMPLOYER",
    passwordHash,
  });
  const omar = await upsertUser({
    name: "Omar Hassan",
    email: "omar@globex.io",
    role: "EMPLOYER",
    passwordHash,
  });
  const alice = await upsertUser({
    name: "Alice Beckham",
    email: "alice@example.com",
    role: "JOB_SEEKER",
    passwordHash,
  });
  const bob = await upsertUser({
    name: "Bob Rahman",
    email: "bob@example.com",
    role: "JOB_SEEKER",
    passwordHash,
  });

  // ---- CATEGORIES ----
  const technology = await upsertCategory({
    name: "Technology",
    slug: "technology",
    description: "Software engineering, development and IT roles",
  });
  const design = await upsertCategory({
    name: "Design",
    slug: "design",
    description: "UI/UX, graphic and product design roles",
  });
  const marketing = await upsertCategory({
    name: "Marketing",
    slug: "marketing",
    description: "Digital marketing, growth and brand roles",
  });
  const finance = await upsertCategory({
    name: "Finance",
    slug: "finance",
    description: "Accounting, analysis and financial planning roles",
  });

  // ---- COMPANIES (APPROVED + PENDING) ----
  const acme = await upsertCompany({
    name: "Acme Corporation",
    location: "Dhaka, Bangladesh",
    website: "https://acmecorp.com",
    description: "A fast-growing product company building developer tools.",
    status: "APPROVED",
    ownerId: sarah.id,
  });
  const globex = await upsertCompany({
    name: "Globex Solutions",
    location: "New York, USA",
    website: "https://globex.io",
    description: "Global consultancy delivering enterprise software.",
    status: "PENDING",
    ownerId: omar.id,
  });

  // ---- JOBS (PUBLISHED x4, CLOSED x1, DRAFT x1) ----
  const reactJob = await upsertJob({
    title: "Senior React Developer",
    description:
      "Own the frontend of our flagship product. Build accessible, performant React applications with TypeScript.",
    salaryMin: 120000,
    salaryMax: 150000,
    location: "Dhaka, Bangladesh",
    jobType: "FULL_TIME",
    experienceLevel: "SENIOR",
    companyId: acme.id,
    categoryId: technology.id,
    status: "PUBLISHED",
  });
  const uxJob = await upsertJob({
    title: "UI/UX Designer",
    description:
      "Design end-to-end product experiences. Run user research, wireframes and high-fidelity mockups.",
    salaryMin: 80000,
    salaryMax: 100000,
    location: "Remote",
    jobType: "REMOTE",
    experienceLevel: "MID",
    companyId: acme.id,
    categoryId: design.id,
    status: "PUBLISHED",
  });
  const backendJob = await upsertJob({
    title: "Backend Engineer (Node.js)",
    description:
      "Design and scale REST APIs and background workers. Strong PostgreSQL and TypeScript skills required.",
    salaryMin: 110000,
    salaryMax: 140000,
    location: "New York, USA",
    jobType: "FULL_TIME",
    experienceLevel: "MID",
    companyId: globex.id,
    categoryId: technology.id,
    status: "PUBLISHED",
  });
  const marketingJob = await upsertJob({
    title: "Marketing Specialist",
    description:
      "Plan campaigns and own growth metrics across paid and organic channels.",
    salaryMin: 50000,
    salaryMax: 65000,
    location: "Remote",
    jobType: "PART_TIME",
    experienceLevel: "JUNIOR",
    companyId: globex.id,
    categoryId: marketing.id,
    status: "PUBLISHED",
  });
  const financeJob = await upsertJob({
    title: "Financial Analyst",
    description:
      "Build financial models and reports to support strategic decisions.",
    salaryMin: 60000,
    salaryMax: 80000,
    location: "Dhaka, Bangladesh",
    jobType: "CONTRACT",
    experienceLevel: "MID",
    companyId: acme.id,
    categoryId: finance.id,
    status: "CLOSED",
  });
  const internJob = await upsertJob({
    title: "Data Analyst Intern",
    description:
      "Work with the analytics team on dashboards and data pipelines. Great first step into data.",
    salaryMin: 20000,
    salaryMax: 30000,
    location: "Dhaka, Bangladesh",
    jobType: "INTERNSHIP",
    experienceLevel: "ENTRY",
    companyId: acme.id,
    categoryId: finance.id,
    status: "DRAFT",
  });

  // ---- APPLICATIONS (public jobs only, varied statuses) ----
  await upsertApplication({
    userId: alice.id,
    jobId: reactJob.id,
    resume: "https://resume.example.com/alice.pdf",
    coverLetter: "I have 5 years building React apps and love mentoring junior devs.",
    status: "ACCEPTED",
  });
  await upsertApplication({
    userId: alice.id,
    jobId: backendJob.id,
    resume: "https://resume.example.com/alice.pdf",
    coverLetter: "Excited to bring my API design experience to Globex.",
    status: "PENDING",
  });
  await upsertApplication({
    userId: alice.id,
    jobId: uxJob.id,
    resume: "https://resume.example.com/alice.pdf",
    status: "REVIEWING",
  });
  await upsertApplication({
    userId: bob.id,
    jobId: uxJob.id,
    resume: "https://resume.example.com/bob.pdf",
    coverLetter: "A designer with 3 years of product design experience.",
    status: "SHORTLISTED",
  });
  await upsertApplication({
    userId: bob.id,
    jobId: reactJob.id,
    resume: "https://resume.example.com/bob.pdf",
    status: "REJECTED",
  });

  // ---- SAVED JOBS ----
  await upsertSavedJob(alice.id, reactJob.id);
  await upsertSavedJob(alice.id, backendJob.id);
  await upsertSavedJob(bob.id, backendJob.id);
  await upsertSavedJob(bob.id, uxJob.id);

  // ---- REVIEWS (only users who applied to a job at that company) ----
  await upsertReview({
    userId: alice.id,
    companyId: acme.id,
    rating: 5,
    comment: "Transparent hiring process and a great engineering culture.",
  });
  await upsertReview({
    userId: alice.id,
    companyId: globex.id,
    rating: 3,
    comment: "Good pay, but the interview process was a bit slow.",
  });
  await upsertReview({
    userId: bob.id,
    companyId: acme.id,
    rating: 4,
    comment: "Clear feedback and quick responses from the recruiter.",
  });

  console.log("--------------- Seed complete ---------------");
  console.log(JSON.stringify(counts, null, 2));
  console.log("Demo logins (password for all: " + SAMPLE_PASSWORD + ")");
  console.log("  Admin   : " + admin.email);
  console.log("  Employer: " + sarah.email + " / " + omar.email);
  console.log("  Seeker  : " + alice.email + " / " + bob.email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });