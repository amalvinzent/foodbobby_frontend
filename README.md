# **FoodBobby**

## **Frontend**

### **How to Run**

1. Clone the project from [GitHub](https://github.com/amalvinzent/foodbobby_frontend):
   ```sh
   git clone https://github.com/amalvinzent/foodbobby_frontend
   ```
2. Navigate to the project directory:
   ```sh
   cd foodbobby_frontend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the development server:
   ```sh
   npm run dev
   ```

## **Backend**

### **How to Run**

1. Clone the project from [GitHub](https://github.com/amalvinzent/foodbobby_backend):
   ```sh
   git clone https://github.com/amalvinzent/foodbobby_backend
   ```
2. Navigate to the project directory:
   ```sh
   cd foodbobby_backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the backend server:
   ```sh
   npm run start:dev
   ```

## **Project Description and Features**

- **User Roles:** Admin, Manager, and User.
- **Authentication:** JWT-based authentication for secure access.
- **Role-Based Access Control (RBAC):** Implemented using role guards to restrict access based on user privileges.
- **User Features:**
  - Sign up and log in.
  - Browse menu items.
  - Add items to the cart and place orders.
- **Admin Features:**
  - Sign up and log in.
  - Manage users, orders, and menus.
- **Manager Features:**
  - Sign up and log in.
  - View orders and menus.

## **Assumptions, Challenges, and Limitations**

- **Refresh Token:** Not implemented but should be added for better authentication handling.
- **State Management:** A scalable state management tool like Zustand should have been used for frontend state handling.
