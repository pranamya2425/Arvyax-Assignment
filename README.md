# Full Stack Wellness App
## Try Here
https://arvyax-assignment-eta.vercel.app/

Welcome to the Full Stack Wellness App! This application allows users to register, log in, and manage their own wellness sessions, such as yoga or meditation flows. Users can create, auto-save, and publish their sessions, and view/edit them from a personalized dashboard.

## ✨ Features

### Frontend (React/Next.js)
-   **User Authentication**: Secure login and registration forms.
-   **Session Editor**: An intuitive interface to create and edit wellness sessions, including:
    -   Session Title
    -   Tags (for categorization)
    -   JSON URL (for session content, e.g., a link to a yoga flow JSON)
-   **Auto-Save**: Sessions are automatically saved as drafts every 30 seconds or after 5 seconds of inactivity.
-   **Visual Feedback**: Real-time indicators for auto-save status (saving, saved).
-   **Dashboard**: A personalized dashboard to view, edit, and manage all your created sessions.
-   **Public Sessions**: Browse published sessions created by the community.
-   **Responsive Design**: Optimized for various screen sizes.

### Backend (Node.js API Routes with MongoDB)
-   **Authentication APIs**: `/api/auth/register` and `/api/auth/login` for user management.
-   **Session Management APIs**: CRUD operations for wellness sessions (`/api/sessions`, `/api/sessions/my-sessions`, `/api/sessions/public`, `/api/sessions/[id]`).
-   **JWT Authentication**: Secure routes using JSON Web Tokens for authorization.
-   **MongoDB Integration**: Persistent storage for user and session data.
-   **Error Handling**: Robust error handling for API endpoints.
-   **Schema Design**: Defined MongoDB schemas for Users and Sessions.

## 💻 Technologies Used

### Frontend
-   [Next.js 15 (App Router)](https://nextjs.org/)
-   [React 18](https://react.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [shadcn/ui](https://ui.shadcn.com/)
-   [Lucide React](https://lucide.dev/icons/) (for icons)

### Backend
-   [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
-   [MongoDB](https://www.mongodb.com/) (Database)
-   [Mongoose](https://mongoosejs.com/) (ODM for MongoDB - *Note: In this specific implementation, raw `mongodb` driver is used for simplicity in the sandbox, but Mongoose is a common choice for Node.js/MongoDB apps.*)
-   [bcryptjs](https://www.npmjs.com/package/bcryptjs) (for password hashing)
-   [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (for JWTs)

## ⚙️ Setup Instructions

Follow these steps to get the project up and running on your local machine.

### 1. Clone the Repository (or Download the Code)

If you downloaded the code from v0, extract the zip file. If you're using Git:

\`\`\`bash
git clone <your-repo-url>
cd wellness-flow-app
\`\`\`

### 2. Install Dependencies

Navigate to the project directory and install the required Node.js packages:

\`\`\`bash
npm install
\`\`\`

### 3. Set Up MongoDB Database

You need a MongoDB database to store user and session data.

#### Option A: MongoDB Atlas (Recommended - Free Tier Available)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account.
2.  Create a new **M0 Sandbox** (Free Tier) cluster.
3.  **Create a Database User**: Go to "Database Access" and add a new user with a strong password. Remember this username and password.
4.  **Configure Network Access**: Go to "Network Access" and add your current IP address or allow access from anywhere (for development convenience).
5.  **Get Connection String**: Go to "Clusters", click "Connect", choose "Connect your application", and copy the connection string. It will look something like:
    \`\`\`
    mongodb+srv://<username>:<password>@<cluster-url>/wellness-app?retryWrites=true&w=majority
    \`\`\`
    **Remember to replace `<username>` and `<password>` with your actual database user credentials.**

#### Option B: Local MongoDB
1.  Install MongoDB on your local machine. Refer to the [official MongoDB documentation](https://docs.mongodb.com/manual/installation/) for instructions specific to your OS.
2.  Start your MongoDB server.
3.  Your connection string will typically be: `mongodb://localhost:27017/wellness-app`

### 4. Configure Environment Variables

Create a file named `.env.local` in the root of your project directory. This file will store your sensitive environment variables.

\`\`\`env
# JWT Secret for authentication tokens
# Generate a strong secret using: openssl rand -base64 64
JWT_SECRET=your_generated_jwt_secret_here

# MongoDB Connection URI
# Replace with your MongoDB Atlas connection string or local URI
MONGODB_URI=your_mongodb_connection_string_here
\`\`\`

**Example `.env.local`:**
\`\`\`env
JWT_SECRET=zMQmJooTR5BPqybuOjLzH2JfE8EytN6DqMgbwgobybwckAgnywfykum3UJXXbZw1vHquPT6k7hPRNdINV2Z+Vg==
MONGODB_URI=mongodb+srv://myuser:mysecretpassword@cluster0.abc123.mongodb.net/wellness-app?retryWrites=true&w=majority
\`\`\`

### 5. Initialize Database Indexes

Run the database setup script to create necessary indexes for performance:

\`\`\`bash
node scripts/setup-database.js
\`\`\`

You should see output similar to:
\`\`\`
Connected to MongoDB
Database indexes created successfully
\`\`\`

### 6. Start the Development Server

Once all dependencies are installed and environment variables are set, start the Next.js development server:

\`\`\`bash
npm run dev
\`\`\`

The application will be accessible at `http://localhost:3000`.

## 🚀 How to Use the App

1.  **Register**: Navigate to `http://localhost:3000/register` to create a new user account.
2.  **Login**: After registration, you'll be redirected to the dashboard. You can also log in at `http://localhost:3000/login`.
3.  **Dashboard**: View all your created wellness sessions.
4.  **Create New Session**: Click the "New Session" button on the dashboard to open the editor.
    -   Enter a **Title**, add **Tags** (e.g., "yoga", "meditation", "beginner"), and provide a **JSON URL** (e.g., a link to a JSON file describing your flow, or paste JSON content directly).
    -   The editor will **auto-save** your work as a draft.
    -   Click "Save Draft" to manually save, or "Publish" to make it public.
5.  **Edit Session**: From the dashboard, click the "Edit" icon on any session card.
6.  **View Public Sessions**: Explore sessions published by others at `http://localhost:3000/sessions`.
7.  **View Individual Session**: Click "View Session" from the public sessions page or dashboard to see details.

## ⚠️ Troubleshooting

-   **"Please add your MongoDB URI to .env.local"**: Ensure your `.env.local` file exists and `MONGODB_URI` is correctly set.
-   **"Invalid email or password" / "Unauthorized"**: Double-check your login credentials. For API routes, ensure your JWT token is being sent correctly (handled by the frontend in this app).
-   **Sessions not appearing**:
    -   Verify your MongoDB connection is active.
    -   Check the browser's developer console for any network errors when fetching sessions.
    -   Ensure the `scripts/setup-database.js` ran successfully.
-   **Auto-save not working**:
    -   Ensure you are logged in.
    -   Check the browser's developer console for JavaScript errors.
    -   Verify network requests to `/api/sessions` are successful.
