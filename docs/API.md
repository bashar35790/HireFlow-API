# HireFlow API Documentation

## Base URL
\`http://localhost:5000/api/v1\`

## General Information

### Response Format
All API responses follow a consistent JSON format:
\`\`\`json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... } // Or an array of objects
}
\`\`\`

For paginated responses, a \`meta\` object is included:
\`\`\`json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
\`\`\`

For errors (success = false), the format is:
\`\`\`json
{
  "success": false,
  "message": "Error description",
  "error": [ ... ] // Optional detailed validation errors or stack trace (in dev)
}
\`\`\`

### Authentication & Authorization
- **Authentication**: JWT via HTTP-only cookie. The cookie is automatically set on successful login/registration.
- **Roles**: \`JOB_SEEKER\`, \`EMPLOYER\`, \`ADMIN\`. Specific routes require specific roles, as documented below.

---

## 1. Auth Module (\`/auth\`)

### Register
- **Method**: \`POST\`
- **Path**: \`/auth/register\`
- **Description**: Register a new user and receive a session cookie.
- **Access**: Public
- **Request Body**:
  - \`name\` (string, required)
  - \`email\` (string, required)
  - \`password\` (string, required, min: 6)
  - \`role\` (string, optional, enum: \`JOB_SEEKER\`, \`EMPLOYER\`)
- **Response**: \`201 Created\` - Returns sanitized user object.

### Login
- **Method**: \`POST\`
- **Path**: \`/auth/login\`
- **Description**: Authenticate user and receive a session cookie.
- **Access**: Public
- **Request Body**:
  - \`email\` (string, required)
  - \`password\` (string, required)
- **Response**: \`200 OK\` - Returns sanitized user object.

### Logout
- **Method**: \`POST\`
- **Path**: \`/auth/logout\`
- **Description**: Clear the authentication cookie.
- **Access**: Public
- **Response**: \`200 OK\`

### Get Current User
- **Method**: \`GET\`
- **Path**: \`/auth/me\`
- **Description**: Retrieve the currently authenticated user's details.
- **Access**: Authenticated users
- **Response**: \`200 OK\` - Returns sanitized user object.

---

## 2. Users Module (\`/users\`)

### List Users
- **Method**: \`GET\`
- **Path**: \`/users\`
- **Description**: Get all users with pagination.
- **Access**: \`ADMIN\`
- **Response**: \`200 OK\` - Array of sanitized user objects.

### Get User by ID
- **Method**: \`GET\`
- **Path**: \`/users/:id\`
- **Description**: Get specific user details.
- **Access**: \`ADMIN\` or the user themselves
- **Response**: \`200 OK\`

### Update User
- **Method**: \`PATCH\`
- **Path**: \`/users/:id\`
- **Description**: Update user details.
- **Access**: \`ADMIN\` or the user themselves
- **Request Body**: \`name\`, \`status\`, etc. (all optional)
- **Response**: \`200 OK\`

### Delete User (Soft Delete)
- **Method**: \`DELETE\`
- **Path**: \`/users/:id\`
- **Description**: Soft delete a user.
- **Access**: \`ADMIN\`
- **Response**: \`200 OK\`

---

## 3. Categories Module (\`/categories\`)

### Create Category
- **Method**: \`POST\`
- **Path**: \`/categories\`
- **Access**: \`ADMIN\`
- **Request Body**: \`name\`, \`slug\`, \`description\`
- **Response**: \`201 Created\`

### List Categories
- **Method**: \`GET\`
- **Path**: \`/categories\`
- **Access**: Public
- **Response**: \`200 OK\`

### Get Category by ID
- **Method**: \`GET\`
- **Path**: \`/categories/:id\`
- **Access**: Public
- **Response**: \`200 OK\`

### Update Category
- **Method**: \`PATCH\`
- **Path**: \`/categories/:id\`
- **Access**: \`ADMIN\`
- **Response**: \`200 OK\`

### Delete Category
- **Method**: \`DELETE\`
- **Path**: \`/categories/:id\`
- **Access**: \`ADMIN\`
- **Response**: \`200 OK\`

---

## 4. Companies Module (\`/companies\`)

### Create Company
- **Method**: \`POST\`
- **Path**: \`/companies\`
- **Access**: \`EMPLOYER\`
- **Request Body**: \`name\`, \`description\`, \`logo\`, \`website\`, \`location\`
- **Response**: \`201 Created\`

### List Companies
- **Method**: \`GET\`
- **Path**: \`/companies\`
- **Access**: Public
- **Response**: \`200 OK\`

### Get Company by ID
- **Method**: \`GET\`
- **Path**: \`/companies/:id\`
- **Access**: Public
- **Response**: \`200 OK\`

### Update Company
- **Method**: \`PATCH\`
- **Path**: \`/companies/:id\`
- **Access**: Owner or \`ADMIN\`
- **Response**: \`200 OK\`

### Delete Company
- **Method**: \`DELETE\`
- **Path**: \`/companies/:id\`
- **Access**: Owner or \`ADMIN\`
- **Response**: \`200 OK\`

---

## 5. Jobs Module (\`/jobs\`)

### Create Job
- **Method**: \`POST\`
- **Path**: \`/jobs\`
- **Access**: \`EMPLOYER\`
- **Request Body**: \`title\`, \`description\`, \`salaryMin\`, \`salaryMax\`, \`location\`, \`jobType\`, \`experienceLevel\`, \`categoryId\`, \`companyId\`
- **Response**: \`201 Created\`

### List Jobs
- **Method**: \`GET\`
- **Path**: \`/jobs\`
- **Query Parameters**: \`search\`, \`category\`, \`location\`, \`jobType\`, \`salaryMin\`, \`salaryMax\`, \`page\`, \`limit\`
- **Access**: Public
- **Response**: \`200 OK\`

### List My Jobs
- **Method**: `GET`
- **Path**: `/jobs/mine`
- **Query Parameters**: `companyId`
- **Access**: `EMPLOYER` or `ADMIN` (employers see their own company's jobs; admins see all)
- **Response**: `200 OK`

### Get Job by ID
- **Method**: \`GET\`
- **Path**: \`/jobs/:id\`
- **Access**: Public
- **Response**: \`200 OK\`

### Update Job
- **Method**: \`PATCH\`
- **Path**: \`/jobs/:id\`
- **Access**: Owner or \`ADMIN\`
- **Response**: \`200 OK\`

### Delete Job
- **Method**: \`DELETE\`
- **Path**: \`/jobs/:id\`
- **Access**: Owner or \`ADMIN\`
- **Response**: \`200 OK\`

---

## 6. Applications Module (\`/applications\`)

### Apply for Job
- **Method**: \`POST\`
- **Path**: \`/applications\`
- **Access**: \`JOB_SEEKER\`
- **Request Body**: \`jobId\`, \`resume\`, \`coverLetter\`
- **Response**: \`201 Created\`

### List All Applications
- **Method**: `GET`
- **Path**: `/applications`
- **Query Parameters**: `jobId`, `status`, `page`, `limit`
- **Access**: `ADMIN` or `EMPLOYER` (employers only see applications for their own jobs)
- **Response**: `200 OK`

### Get My Applications
- **Method**: `GET`
- **Path**: `/applications/my`
- **Access**: `JOB_SEEKER`
- **Response**: `200 OK`

### Get Application Status
- **Method**: `GET`
- **Path**: `/applications/:id/status`
- **Access**: Applicant or Owner (status of own application)
- **Response**: `200 OK`

### Get Application by ID
- **Method**: \`GET\`
- **Path**: \`/applications/:id\`
- **Access**: Applicant or Employer
- **Response**: \`200 OK\`

### Update Application Status
- **Method**: \`PATCH\`
- **Path**: \`/applications/:id/status\`
- **Access**: \`EMPLOYER\` (owner of the job)
- **Request Body**: \`status\` (\`REVIEWING\`, \`SHORTLISTED\`, \`REJECTED\`, \`ACCEPTED\`)
- **Response**: \`200 OK\`

### Delete Application
- **Method**: \`DELETE\`
- **Path**: \`/applications/:id\`
- **Access**: \`JOB_SEEKER\` (applicant only)
- **Response**: \`200 OK\`

---

## 7. Saved Jobs Module (\`/saved-jobs\`)

### Save Job
- **Method**: \`POST\`
- **Path**: \`/saved-jobs\`
- **Access**: \`JOB_SEEKER\`
- **Request Body**: \`jobId\`
- **Response**: \`201 Created\`

### Get My Saved Jobs
- **Method**: \`GET\`
- **Path**: \`/saved-jobs/my\`
- **Access**: \`JOB_SEEKER\`
- **Response**: \`200 OK\`

### Unsave Job
- **Method**: \`DELETE\`
- **Path**: \`/saved-jobs/:jobId\`
- **Access**: \`JOB_SEEKER\`
- **Response**: \`200 OK\`

---

## 8. Reviews Module (\`/reviews\`)

### Create Review
- **Method**: \`POST\`
- **Path**: \`/reviews\`
- **Access**: \`JOB_SEEKER\`
- **Request Body**: \`companyId\`, \`rating\`, \`comment\`
- **Response**: \`201 Created\`

### List Reviews
- **Method**: \`GET\`
- **Path**: \`/reviews\`
- **Access**: Public
- **Response**: \`200 OK\`

### Get Review by ID
- **Method**: \`GET\`
- **Path**: \`/reviews/:id\`
- **Access**: Public
- **Response**: \`200 OK\`

### Update Review
- **Method**: \`PATCH\`
- **Path**: \`/reviews/:id\`
- **Access**: Review Owner
- **Response**: \`200 OK\`

### Delete Review
- **Method**: \`DELETE\`
- **Path**: \`/reviews/:id\`
- **Access**: Review Owner or \`ADMIN\`
- **Response**: \`200 OK\`
