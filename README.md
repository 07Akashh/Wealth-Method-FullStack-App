# The Wealth Method

The Wealth Method is a wealth-management app split into two parts:

- `Backend/`: Express + MongoDB API with JWT sessions, Redis-backed revocation, email flows, and security middleware.
- `TheWealthMethod/`: Expo React Native app with authentication, profile/security controls, device session management, and app locking.

This README documents the current codebase flow end to end: how a new user registers, how login works, which security layers exist, and how device management is handled.

## Project Structure

### Backend

- `src/server.js`: boots Express, connects MongoDB, initializes Redis, and mounts the app.
- `src/config/expressConfig.js`: sets Helmet, CORS, rate limiting, cookies, and method override.
- `src/routes/index.js`: mounts `/user`, `/transaction`, and `/goal` routes under `/api/v1`.
- `src/modules/user/`: registration, login, password reset, profile, and session/device management.
- `src/modules/transaction/` and `src/modules/goal/`: authenticated CRUD and mobile sync routes.

### Frontend

- `src/app/providers.tsx`: app bootstrap, theme provider, push permission request, navigation wrapper, and app lock gate.
- `src/navigation/AuthNavigator.tsx`: login, signup, forgot password, reset PIN, and OTP screens.
- `src/screens/Auth/`: authentication screens.
- `src/screens/Profile/`: profile, security, and settings screens.
- `src/services/authService.ts`: API bridge for login, signup, profile, password, and session actions.
- `src/store/userStore.ts`: persisted user/security state, local lock state, and profile sync.

## High-Level Architecture

1. The mobile app starts in `AppProviders` and waits for persisted state to hydrate.
2. If the user is authenticated and the app is locked, `AuthLockScreen` is shown.
3. Otherwise the app renders the main navigator and bottom sheets.
4. The backend protects all API routes with global security middleware and requires authenticated JWT sessions for user, goal, and transaction actions.

## Backend Behavior

### Security Layers

- `helmet()` adds standard security headers.
- CORS is restricted to configured origins.
- A global rate limiter protects `/api/*`.
- A stricter auth limiter protects `/api/v1/auth/*`.
- `basicAuth` protects `/api/v1` with HTTP Basic credentials before the route handlers run.
- Authenticated routes validate Bearer tokens and reject revoked or expired sessions.

### Session Model

- Each login creates a JWT with a `jti`.
- The `jti` is stored in Redis and in the `Session` collection.
- This allows session listing, session revocation, and revoke-all-other-devices behavior.

### User Record

The user model stores:

- name, email, phone
- role and status flags
- preferred currency
- privacy mode and biometric access toggles
- password hash/salt or temporary password hash
- password reset token data
- last login time

## End-to-End User Registration Flow

1. The user opens the app and taps `Sign Up`.
2. The signup screen collects first name, last name, email, and mobile number.
3. The frontend sends the request to `POST /api/v1/user/signup`.
4. The backend checks whether the email already exists.
5. The backend generates a temporary password, hashes a placeholder password, stores the temporary password hash, and marks the account active.
6. The backend sends a welcome email containing the temporary password.
7. If the email send fails, the backend rolls the account creation back.
8. The frontend returns the user to the login screen after signup succeeds.

Important current behavior:

- The backend ignores any password submitted during signup.
- First login is expected to happen with the emailed temporary password.
- Once logged in, the user should change the password from the app.

## End-to-End Login Flow

1. The user opens the login screen and enters an email or phone number plus password.
2. The frontend validates the identity and password format before sending the request.
3. The app sends `POST /api/v1/user/login`.
4. The backend looks up the user by email or phone.
5. The backend compares the submitted password against either the permanent hash or the temporary password hash.
6. If valid, the backend:
	- generates a JWT,
	- stores the session `jti` in Redis,
	- creates a session document with device information,
	- updates the user's last login time,
	- returns the access token and profile data.
7. The frontend stores the auth state and routes into the main app.

## Password Recovery Flow

1. The user taps `Forgot Password`.
2. The app calls `POST /api/v1/user/forgot-password`.
3. The backend creates a one-time token, emails a reset link or code, and stores the token timestamp.
4. The user submits the token plus a new password to `POST /api/v1/user/reset-password`.
5. The backend validates the token and age, then replaces the password hash and clears the reset token.

## Account and Profile Flow

After login, authenticated routes support:

- `GET /api/v1/user/profile`
- `PUT /api/v1/user/profile`
- `POST /api/v1/user/change-password`

The frontend profile state is persisted locally and synced back to the backend for fields such as:

- preferred currency
- privacy mode
- biometric access
- avatar image

## Device Management Flow

The app tracks active sessions as devices.

### What gets recorded on login

- device name from the mobile platform
- user agent
- IP address when available
- browser/app hint
- JWT `jti`

### What the user can do in the app

- View active sessions on the Security screen.
- Revoke the current session.
- Revoke any specific session.
- Revoke all other sessions.

### Backend endpoints

- `GET /api/v1/user/sessions`
- `DELETE /api/v1/user/sessions/:sessionId`
- `DELETE /api/v1/user/sessions/others`
- `POST /api/v1/user/logout`

## Security Features in the App

The mobile app includes several layers of local and account-level protection:

- Biometric app lock using Face ID or fingerprint.
- Optional app PIN lock.
- Privacy mode to hide sensitive balances.
- Wipe-data toggle for local protection after failed attempts.
- Active device/session visibility.
- New-device login preference in notification settings.
- Push-notification permission request during app startup.

The app also locks itself when it goes to the background or becomes inactive if biometric or PIN protection is enabled.

## Main Product Areas

The current codebase also includes authenticated financial modules for:

- transactions, including dashboard stats, insights, sync, receipts, create/update/delete
- goals, including sync, create/update/delete

These are protected by JWT authentication and live under the same API surface as the user system.

## Run Locally

### Backend

```bash
cd Backend
pnpm install
pnpm dev
```

### Frontend

```bash
cd TheWealthMethod
pnpm install
pnpm start
```

## Notes on the Current Implementation

- Signup is email-driven and sends a temporary password by email.
- Login accepts email or phone on the backend, even though the current login screen labels the field as email or phone.
- Session revocation is backed by both MongoDB and Redis.
- Some UI items are marked as coming soon, including passkeys and legacy contact.
- The README reflects source inspection of the current workspace; I did not run the mobile or backend apps from this file alone.

## Suggested User Journey

1. Register from the mobile app.
2. Check email for the temporary password.
3. Log in with the temporary password.
4. Change the password immediately.
5. Enable biometrics or PIN in Security.
6. Review active sessions and revoke any unknown devices.
7. Continue using transactions and goals with the account protected by JWT sessions and app-level locking.
