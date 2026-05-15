# The Wealth Method 🏦

**The Wealth Method** is a premium, high-fidelity financial management portal designed to transform your wealth tracking into a data-driven, editorial experience. Built for those who prioritize privacy and performance, it offers an offline-first, vault-secured architecture for managing targets, transactions, and long-term financial growth.

---

## 🔒 Security & Authentication
As this is a **fully functional demo**, the security layer is designed to be both rigorous and easy to navigate for testing.

### Login Method: 4-Digit Secure PIN
1.  **First Launch (Onboarding)**:
    *   You will be asked to complete your profile (Name & Email).
    *   **Create Your PIN**: Set a unique 4-digit PIN. This is stored locally in your device's secure enclave.
2.  **Subsequent Access**:
    *   Every time you re-open the app or the session locks, you must enter your **4-digit PIN**.
    *   **Failed Attempts**: For security, if you exceed 10 failed attempts, the vault logic is designed to trigger a local data wipe (Enterprise-grade privacy).
3.  **Biometric Bypass**:
    *   Once a PIN is set, you can enable **FaceID / TouchID** in the Profile settings.
    *   On future logins, tap the "FaceID" icon on the Keypad to unlock instantly.

---

## 🚀 Key Features

### 🏦 The Vault (Wealth Strategy)
*   **Auto-Allocation Engine**: Distributes your total liquid balance across multiple objectives based on priority and progress.
*   **Dynamic Projections**: See exactly when you'll reach your targets (e.g., "OCT 2027") based on your real-time monthly saving rate (Income - Expenses).
*   **Goal Management**: Create and track specific objectives (Emergency Fund, Estate, Trip, etc.) with automated streak tracking.

### 📊 Editorial Analytics
*   **Wealth Hub Dashboard**: A high-fidelity, animated overview of your total balance, monthly performance, and category breakdowns.
*   **Categorized Spending**: Visualize exactly where your money goes with color-coded spending charts.
*   **Privacy Mode**: One-tap "Confidentiality" toggle on the Home screen to mask all sensitive balances (••••) for safe public viewing.

### 🌐 Multi-Currency Sync
*   **Instant Conversion**: Seamlessly switch between global currencies (USD, EUR, GBP, JPY, etc.) with **INR as the baseline default**.
*   **Live Exchange Rates**: Integrated with the Frankfurter API for real-time currency calculation and symbol synchronization.

---

## 🛠️ Technology Stack
*   **Framework**: Expo (React Native)
*   **Database**: SQLite (Offline-first, data never leaves your device)
*   **State Management**: TanStack Query (Server state) & Zustand (Global UI state)
*   **Animations**: React Native Reanimated (60fps fluid UI)
*   **Icons**: Lucide Native (Premium icon set)

---

## 🏗️ Installation & Setup

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/07Akashh/TheWealthMethod.git
    cd TheWealthMethod
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Start the Development Server**:
    **npx expo start**

4.  **Run on Device**:
    *   Download the **Expo Go** app on your iOS/Android device.
    *   Scan the QR code from your terminal.
    *   *Note: For the best experience, use a physical device to test Biometric (FaceID) features.*

---

## 🏗️ Technical Decisions and Trade-offs

*   **Offline-First Architecture (SQLite)**: We prioritized absolute privacy and low latency. By using a local-only SQLite engine, data never leaves the user's device, eliminating the need for complex cloud sync while ensuring 100% responsiveness even without internet access.
*   **TanStack Query + SQLite Service**: While SQLite is synchronous by nature, we wrapped it in an asynchronous service layer managed by TanStack Query. This allows for background data revalidation (e.g., currency rates) and automated cache invalidation, ensuring the UI is always synchronized with the database.
*   **Zustand for UI State**: We chose Zustand for its minimal footprint and rapid performance compared to Redux, resulting in a streamlined global state for non-persistent UI flags like the "Confidentiality" mask.
*   **Performance vs. Visuals**: To achieve 60fps animations on complex charts and dashboards while maintaining a standard React Native layout, we heavily utilized `React Native Reanimated` and `Memoization` (useMemo/useCallback) for layout-heavy calculations.

---

## 📝 Additional Notes

*   **🔒 Demo Security Access**: For rapid testing and evaluation, the recommended **Default Testing PIN** is: **`1234`**. 
*   **Data Integrity**: Upon first launch, the application automatically seeds the local database with sample transactions and goals to ensure the dashboard reflects a full "wealthy" state immediately.
*   **Currency Defaults**: The system defaults to **INR (₹)** for all baseline wealth calculations. You can modify your preferred display currency and symbol at any time in the Profile settings.

---

## 📜 License
© 2026 The Wealth Method. All Rights Reserved. Designed for premium financial management.
