
# Leave Management System (Frontend)

A simple React + Vite frontend that demonstrates a leave management workflow. Users can log in (mock), view their leave balance, apply for leave, and view their leave history. Logging in as “admin” enables administrative actions (approve/reject requests). All data is persisted in the browser via localStorage; there is no backend.

## Features
- Mock authentication (type “admin” to get admin role).
- Apply for leave with start/end dates and optional reason.
- Auto-calculation of leave duration (inclusive of both dates).
- View personal leave history (users) or all leave applications (admin).
- Approve or reject pending leave applications (admin).
- Local persistence using localStorage.

## Tech Stack
- React (with react-router-dom for navigation)
- Vite
- JavaScript (ES Modules)
- localStorage for data persistence
- ESLint for basic linting

## Getting Started

### Prerequisites
- Node.js (LTS recommended) and npm

### Installation
- Windows (PowerShell or Command Prompt):
  - cd c:\Users\Admin\OneDrive\Desktop\projects\leave_mgmt_sys\frontend
  - npm install

### Development
- Start the dev server:
  - npm run dev
- Open the printed local URL (e.g., http://localhost:5173).

### Production Build
- Create a production build:
  - npm run build
- Preview the build locally:
  - npm run preview

## Usage
1. Open the app and log in with a username.
   - Enter “admin” to log in as an administrator.
   - Any other username logs in as a normal user.
2. Dashboard:
   - View remaining leave balance.
   - Apply for leave by selecting start/end dates and adding a reason (optional).
   - See your leave history (admins see all requests).
3. Admin actions:
   - For requests with status “pending”, approve or reject them from the history table.

## Project Structure

```
frontend/
├─ .gitignore
├─ eslint.config.js
├─ index.html
├─ package.json
├─ README.md
├─ vite.config.js
├─ public/
└─ src/
   ├─ App.css
   ├─ App.jsx
   ├─ index.css
   ├─ main.jsx
   ├─ assets/
   ├─ components/
   │  ├─ LeaveForm.jsx
   │  ├─ LeaveHistory.jsx
   │  └─ LoginPage.jsx
   ├─ pages/
   │  └─ Dashboard.jsx
   ├─ services/
   │  ├─ authService.jsx
   │  └─ leaveService.jsx
   └─ utils/
```

### Key Files and Their Roles

- index.html
  - Vite HTML entry.

- src/main.jsx
  - React entry point; mounts the React app.

- src/App.jsx
  - Root component; typically wires routing (e.g., Login and Dashboard).

- src/index.css, src/App.css
  - Global and component styles.

- src/components/LoginPage.jsx
  - Mock login form using a plain username.
  - “admin” gives role: admin; anything else gives role: user.
  - Navigates to the dashboard after login.

- src/pages/Dashboard.jsx
  - Displays a welcome header and logout button.
  - Shows current leave balance (computed via leaveService).
  - Renders:
    - LeaveForm for submitting a new request.
    - LeaveHistory to list requests and (for admins) action buttons.

- src/components/LeaveForm.jsx
  - Form to submit leave applications.
  - Fields: start date, end date, optional reason.
  - Computes days via leaveService.calculateDays.
  - Persists a request to localStorage via leaveService.applyLeave.

- src/components/LeaveHistory.jsx
  - Lists leave requests in a table.
  - For normal users: shows only their own requests.
  - For admins: shows all requests and provides Approve/Reject actions.
  - Refreshes the list after an action.

- src/services/leaveService.jsx
  - LocalStorage-backed data operations:
    - applyLeave(leaveData): adds a new leave request (returns a Promise).
    - getLeavesByUser(username): returns an array of that user’s requests.
    - getAllLeaves(): returns an array of all requests.
    - adminSetStatus(id, status): updates the status (approved/rejected).
    - getLeaveBalance(username): computes remaining balance (default 20 days minus approved days).
    - calculateDays(startDate, endDate): inclusive date difference in days.

- src/services/authService.jsx
  - Placeholder for authentication utilities (if needed by App routing).

- src/utils/
  - Reserved for helper utilities (none required for the current functionality).

## Data Persistence
- Stored in browser localStorage under the key: lms_leaves_v1.
- To reset demo data:
  - Open the app in your browser.
  - Open Developer Tools → Application (or Storage) → Local Storage.
  - Remove the key lms_leaves_v1, or run:
    - localStorage.removeItem('lms_leaves_v1')

## Scripts (npm)
- npm run dev: Start development server.
- npm run build: Build for production.
- npm run preview: Preview the production build locally.

## Troubleshooting
- If you see errors related to user role in LeaveHistory:
  - Ensure the component receives currentUser and checks role safely (e.g., optional chaining).
- If leave history does not update after actions:
  - Confirm adminSetStatus resolves successfully and that the list is refetched.
- If balance does not update after applying/approving leave:
  - Trigger a refresh or ensure the dashboard re-queries getLeaveBalance after changes.

## Notes
- This project is frontend-only and uses localStorage. It is intended for demonstration purpose.