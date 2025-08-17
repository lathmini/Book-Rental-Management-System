**📚 Book Rental Management System**

A full-stack application for managing book rentals in a small community library.

**Backend**: Java 17, Spring Boot, MySQL (Dockerized).

**Frontend**: React.js.


🚀 **Features**

Manage Books (Add, Update, Delete, View).

Manage Rentals (Create, Update, View History).

REST APIs for frontend integration.

Simple React UI for rentals.


⚙️ **Prerequisites**

Before running the project, install:

Java 17+

Maven

Node.js & npm

Docker


**🛠️Backend Setup**

1.Clone the repository

git clone https://github.com/lathmini/Book-Rental-Management-System.git cd Book-Rental-Management-System/backend

2.Start MySQL with Docker Run this command to create a MySQL container:

docker run --name brms-mysql
-e MYSQL_ROOT_PASSWORD=brms123
-e MYSQL_DATABASE=brms_db
-p 3308:3306
-d mysql:8.0

**⚠️ Note:**

MySQL is mapped to host port 3308.

Database name: brms_db

Username: root

Password: brms123

**3.**Check container is running

docker ps

**4.**Run the backend

mvn spring-boot:run

The backend will start at: 👉 http://localhost:8080

🎨 **Frontend Setup**

**Install dependencies:**

npm install

**Start the React app:**

npm start

The frontend will be available at: 👉 http://localhost:3000

📌** API Documentation**

Postman collection is included in /docs
