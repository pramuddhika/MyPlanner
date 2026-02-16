# MyPlanner

A full-stack task management application built with **Spring Boot 4** (Backend) and **React 19 + TypeScript** (Frontend). Features include user authentication (JWT), task CRUD with categories & statuses, calendar view, real-time notifications via WebSocket, and dark/light theme support.

---

## Tech Stack

| Layer    | Technology                                                                 |
| -------- | -------------------------------------------------------------------------- |
| Backend  | Java 21, Spring Boot 4.0.2, Spring Data JPA, MySQL, JWT, WebSocket, Swagger |
| Frontend | React 19, TypeScript, Redux Toolkit, Tailwind CSS 4, Vite 7, shadcn/ui    |

---

## Prerequisites

Make sure you have the following installed before starting:

- **Git**
- **Java 21** (JDK)
- **Maven 3.9+**
- **MySQL 8+**
- **Node.js 20+** & **npm 10+**

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/MyPlanner.git
```

```bash
cd MyPlanner
```

---

### 2. Database Setup

Open **MySQL Workbench** or any MySQL client and run the SQL script to create the schema, tables, and seed data:

```bash
mysql -u root -p < backend/dbscript.sql
```

> Or copy and paste the contents of `backend/dbscript.sql` into your MySQL client and execute it.

This will create:
- `myplanner` schema
- `user`, `categoryList`, `status`, and `task` tables
- Default status values: **To Do**, **In Progress**, **On Hold**, **Done**

---

### 3. Configure Backend (application.properties)

Create or edit the file at:

```
backend/myplanner-be/myplanner-be/src/main/resources/application.properties
```

Paste the following and update the values to match your environment:

```properties
spring.application.name=myplanner-be

# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/myplanner
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.hibernate.naming.physical-strategy=org.hibernate.boot.model.naming.PhysicalNamingStrategyStandardImpl

# JWT Configuration
jwt.secret=YOUR_JWT_SECRET_KEY_AT_LEAST_256_BITS_LONG
jwt.expiration=86400000

# Swagger / SpringDoc
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
springdoc.swagger-ui.enabled=true
springdoc.swagger-ui.operationsSorter=method
springdoc.swagger-ui.tagsSorter=alpha
springdoc.swagger-ui.tryItOutEnabled=true
springdoc.swagger-ui.filter=true
springdoc.swagger-ui.syntaxHighlight.activated=true
springdoc.swagger-ui.displayRequestDuration=true
springdoc.swagger-ui.defaultModelsExpandDepth=2
springdoc.swagger-ui.defaultModelExpandDepth=2
springdoc.swagger-ui.docExpansion=none
```

| Variable               | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `spring.datasource.username` | Your MySQL username (e.g. `root`)              |
| `spring.datasource.password` | Your MySQL password                            |
| `jwt.secret`           | A secret string (min 256 bits / 32+ characters) for signing JWT tokens |
| `jwt.expiration`       | Token expiry in milliseconds (default: `86400000` = 24 hours) |
| `server.port`          | Backend server port (default: `8080`)                |

---

### 4. Install Backend Dependencies

```bash
cd backend/myplanner-be/myplanner-be
```

```bash
mvn clean install
```

---

### 5. Run the Backend

```bash
mvn spring-boot:run
```

The backend will start at **http://localhost:8080**.

Swagger UI available at: **http://localhost:8080/swagger-ui.html**

---

### 6. Install Frontend Dependencies

Open a **new terminal** and run:

```bash
cd frontend
```

```bash
npm install
```

---

### 7. Run the Frontend

```bash
npm run dev
```

The frontend will start at **http://localhost:5173** (default Vite port).

---

## Project Structure

```
MyPlanner/
├── backend/
│   ├── dbscript.sql                          # Database schema & seed data
│   └── myplanner-be/myplanner-be/
│       ├── pom.xml                           # Maven dependencies
│       └── src/main/
│           ├── java/com/todoapp/myplanner_be/
│           │   ├── config/                   # Security, JWT, WebSocket config
│           │   ├── controller/               # REST API controllers
│           │   ├── dto/                      # Data Transfer Objects
│           │   ├── entity/                   # JPA entities
│           │   ├── repository/               # Spring Data repositories
│           │   └── service/                  # Business logic
│           └── resources/
│               └── application.properties    # App configuration
│
├── frontend/
│   ├── package.json                          # npm dependencies & scripts
│   ├── vite.config.ts                        # Vite configuration
│   └── src/
│       ├── components/                       # React components
│       │   ├── calendar/                     # Calendar view components
│       │   ├── categories/                   # Category dialogs
│       │   ├── layout/                       # Sidebar, Dashboard layout
│       │   ├── notifications/                # Toast notifications
│       │   ├── tasks/                        # Task CRUD dialogs
│       │   └── ui/                           # shadcn/ui components
│       ├── hooks/                            # Custom hooks (auth, theme)
│       ├── pages/                            # Page components
│       ├── services/                         # API & WebSocket services
│       ├── store/                            # Redux store & slices
│       └── types/                            # TypeScript types
│
└── README.MD
```

---

## Quick Start (All Commands)

```bash
# 1. Clone
git clone https://github.com/<your-username>/MyPlanner.git
cd MyPlanner

# 2. Database setup
mysql -u root -p < backend/dbscript.sql

# 3. Configure application.properties (edit the file at the path below)
#    backend/myplanner-be/myplanner-be/src/main/resources/application.properties

# 4. Install & run backend
cd backend/myplanner-be/myplanner-be
mvn clean install
mvn spring-boot:run

# 5. Install & run frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## Available Scripts

### Backend

| Command                | Description                       |
| ---------------------- | --------------------------------- |
| `mvn clean install`    | Install dependencies & build      |
| `mvn spring-boot:run`  | Start the backend server          |

### Frontend

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm install`     | Install dependencies                 |
| `npm run dev`     | Start dev server (hot reload)        |


---

## Features

- **User Authentication** — Sign up, login, JWT-based session
- **Task Management** — Create, edit, delete tasks with title, description, dates & reminders
- **Categories** — Organize tasks into custom categories
- **Status Tracking** — To Do, In Progress, On Hold, Done
- **Calendar View** — Monthly calendar with task indicators
- **Real-time Notifications** — WebSocket-powered task reminders
- **Dark / Light Theme** — Toggle between themes (preference persisted)
- **Swagger API Docs** — Interactive API documentation
