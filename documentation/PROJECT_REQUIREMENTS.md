# HashVault: Project Requirements & Architecture

## 1. Project Overview
**HashVault** is a modern, web-based integrity verification platform designed for generating, comparing, and managing cryptographic hashes for files and plain text. Built with a focus on cybersecurity, the platform supports standard cryptographic algorithms (**MD5, SHA-1, SHA-256, and SHA-512**). It stores operational history securely in Supabase, offers dynamic data visualization dashboards, and provides automated CRUD screens to manage the application's entire lifecycle.

### Problem Statement
Organizations and individuals require a fast, reliable, and auditable method to verify file and text integrity. Existing tools are typically standalone, lack operational history, and do not provide structured project monitoring or administrative controls.

### Solution
HashVault solves this by offering a Next.js web application with:
* Drag-and-drop file hashing and real-time text hashing
* Automated hash comparison
* Centralized hash history and comparison logs
* Secure authentication and Row-Level Security (RLS)
* CRUD-based administration and process automation screens
* Dashboards for KPI tracking, monitoring, and analytics

---

## 2. Business Plan & Financial Analysis
*Note: This is an illustrative model designed for academic project evaluation.*

### Value Proposition
HashVault accelerates security operations by providing a unified, cloud-backed tool for cryptographic verification, replacing fragmented manual workflows.

### Financial Model
* **Development Effort:** ~170 hours
* **Development Cost:** 170 hrs × $10/hr = **$1,700**
* **Annual Operating Cost:** **$120** (domain, hosting, minimal maintenance)
* **Monthly Value Created:** 300 users × 5 minutes saved × $15/hr labor value = **$375/month**
* **Annual Value:** **$4,500/year**

### ROI & Payback Period
* **Net Annual Benefit:** $4,500 - $120 = **$4,380**
* **ROI:** (($4,380 - $1,700) / $1,700) × 100 = **157.6%**
* **Payback Period:** $1,700 / $365 (monthly net) = **~4.7 months**

**Conclusion:** The project is highly justified financially as a low-cost, high-value internal operational tool.

---

## 3. Requirements Scope

### Functional Requirements (In Scope)
1. **Hash Generation:** Generate cryptographic hashes from uploaded files (via drag-and-drop) and plain text.
2. **Comparison:** Compare two hashes visually and logically to confirm match/mismatch status.
3. **Data Persistence:** Save hash histories and comparison logs to a Supabase PostgreSQL database.
4. **CRUD Operations:** Create, Read, Update, and Delete historical records, configurations, and logs.
5. **Authentication:** Secure user authentication using Supabase Auth.
6. **Authorization:** Role-Based Access Control enforced strictly via Row-Level Security (RLS).
7. **Dashboards:** Visualize key performance indicators (KPIs), requirements status, and analytics.

### Non-Functional Requirements
1. **Performance:** Fast client-side hashing using Web Crypto APIs.
2. **Security:** Secure data handling, protected API routes, and no server-side storage of raw files.
3. **Usability:** Responsive, dark-themed, cybersecurity-oriented design ensuring a clear UX for all users.
4. **Maintainability:** Modular component architecture using Next.js App Router and React Hooks.

---

## 4. Process Automation & CRUD Screens

The application is heavily driven by CRUD (Create, Read, Update, Delete) processes that automate administrative and operational workflows:

### 1. Hash Generator (Home)
* **Process:** Automatically handles file streams and text inputs to compute cryptographic hashes on the client.
* **Database Connection:** Automatically triggers `INSERT` operations into the `hash_history` table upon successful hash generation.

### 2. Hash History (CRUD Screen)
* **Process:** Automates the retrieval and management of previous cryptographic operations.
* **Database Connection:** Performs `SELECT`, `UPDATE` (if metadata changes are allowed), and `DELETE` operations on the `hash_history` table, filtered securely by `user_id` using RLS.

### 3. Comparison Tool (CRUD Screen)
* **Process:** Automates the verification of two arbitrary hashes, logging the success/failure state.
* **Database Connection:** Connects to the `comparison_logs` table to save and review verification audits.

### 4. Configuration Management (CRUD Screen)
* **Process:** Automates system-wide parameters (e.g., allowed algorithms, max upload sizes).
* **Database Connection:** Connects to the `configurations` table. Read-only for standard users, fully mutable (`INSERT`, `UPDATE`, `DELETE`) for Administrators.

### 5. Requirements Monitoring Dashboard
* **Process:** Automates the tracking of project completion, tracing requirements to test cases and application screens.
* **Database Connection:** Dynamically fetches from a future `requirements` table to build visual progress bars.

### 6. Admin Analytics Dashboard
* **Process:** Automates the aggregation of system metrics, rendering burndown charts and velocity metrics without manual calculation.
* **Database Connection:** Aggregates data from `hash_history`, `comparison_logs`, and `sprint_metrics` tables.

---

## 5. Database Architecture & Connection

HashVault uses a modern Serverless PostgreSQL database (Supabase) accessed via standard Next.js Server-Side Rendering (SSR) patterns.

### Schema Overview
* `auth.users`: Managed automatically by Supabase Authentication.
* `public.hash_history`: Stores generated hashes (`hash_value`, `algorithm`, `source_type`).
* `public.comparison_logs`: Stores audits of hash verifications (`hash_1`, `hash_2`, `match_status`).
* `public.configurations`: Stores dynamic app settings as JSONB.

### Connection Strategy
1. **Next.js Middleware:** Intercepts every route request to validate the user's JWT securely. Unauthenticated requests are immediately bounced.
2. **Supabase SSR:** Uses `@supabase/ssr` to synchronize cookies between the Next.js backend and the browser frontend.
3. **Row-Level Security (RLS):** The most critical layer. Instead of relying purely on frontend UI hiding, the database enforces security at the PostgreSQL kernel level. For example:
   ```sql
   CREATE POLICY "Users can view own hash history" ON public.hash_history
     FOR SELECT USING (auth.uid() = user_id);
   ```
   This guarantees that even if a user manipulates an API request, the database will mathematically reject attempts to view or alter another user's data.
