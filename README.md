# DevLink API

A RESTful API for connecting developers — built with **Node.js**, **Express**, and **MongoDB (Mongoose)**.

DevLink allows developers to create profiles, share posts, react to content, and build connections with one another.

---

## 🚀 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (via Mongoose ODM)
- **Testing** Insomnia

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/AaronPrimmer/devlink.git
cd devlink

# Install dependencies
npm install

# Create a .env file and add your environment variables
cp .env.EXAMPLE .env

# Start the server
npm start

# **To Use Nodemon**
npm run dev
```

### Environment Variables

```env
DB_NAME="your_db_name"
DB_USER="mongodb_username"
DB_PASSWORD="mongodb_password"
DB_URL="url_of_db" (optional for external database)
```

---

## 📋 API Endpoints

### 👤 Developer Profile

| Method   | Endpoint              | Description                       |
| -------- | --------------------- | --------------------------------- |
| `POST`   | `/api/developers`     | Create a developer profile        |
| `GET`    | `/api/developers`     | Get all developer profiles        |
| `GET`    | `/api/developers/:id` | Get the current user's profile    |
| `PUT`    | `/api/developers/:id` | Update the current user's profile |
| `DELETE` | `/api/developers/:id` | Delete the current user's profile |

#### Example Request — Create Profile

```json
POST /api/developers

{
  "firstname": "Joe",
  "lastname": "Smith",
  "email": "email@email.com",
  "birthdate": "DATETIME",
  "password": "password",
  "skills": ["Javascript", "HTML", "CSS"],
  "github": "YOUR_HANDLE(OPTIONAL)",
  "linkedIn": "YOUR_HANDLE(OPTIONAL)"
}
```

---

### 📝 Posts

| Method   | Endpoint         | Description         |
| -------- | ---------------- | ------------------- |
| `POST`   | `/api/posts`     | Create a new post   |
| `GET`    | `/api/posts`     | Get all posts       |
| `GET`    | `/api/posts/:id` | Get a post by ID    |
| `PUT`    | `/api/posts/:id` | Update a post by ID |
| `DELETE` | `/api/posts/:id` | Delete a post by ID |

#### Example Request — Create Post

```json
POST /api/posts

{
  "title": "My First DevLink Post",
  "content": "Excited to share my latest project with the community!",
  "author": "USER_OBJECTID"
}
```

---

### 💬 Reactions

Reactions are tied to a specific post.

| Method   | Endpoint                           | Description              |
| -------- | ---------------------------------- | ------------------------ |
| `POST`   | `/api/posts/reaction`              | Add a reaction to a post |
| `PUT`    | `/api/posts/:postId/reactions/:id` | Update a reaction        |
| `DELETE` | `/api/posts/:postId/reactions/:id` | Delete a reaction        |

---

### 🤝 Connections

| Method   | Endpoint                                                 | Description                      |
| -------- | -------------------------------------------------------- | -------------------------------- |
| `POST`   | `/api/developers/:developerId/connections/:connectionId` | Send a connection to a developer |
| `DELETE` | `/api/developers/:developerId/connections/:connectionId` | Remove a connection              |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙌 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
