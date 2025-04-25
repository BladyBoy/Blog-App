# Blog App API

This project is a fully functional RESTful API built for a blog application, developed using Node.js, Express.js, MongoDB, and JWT-based authentication. It enables users to securely register and log in, create and manage blog posts, and engage through comments. 
- The API supports full CRUD operations with robust validation, error handling, and role-based access control to ensure secure content management. 
- Designed with clean architecture principles, modular route handling, and comprehensive testing, the project showcases my ability to build scalable backend systems from scratch, write maintainable code, and document professional-grade APIs using Postman.

**In short** : It's a secure and scalable REST API for a blog app with user authentication, post/comment management, and complete CRUD support using Node.js, Express, and MongoDB.

## 📦 Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Token), bcryptjs
- **Testing**: Jest, Supertest
- **API Documentation**: Postman
- **SEO-Friendly URLs**: Slugify

## 📁 Project Structure

    BlogApp/
    ├── coverage/
    ├── node_modules/
    ├── src/
    │   ├── config/
    │   │   └── db.js
    │   ├── controllers/
    │   │   └── userController.js
    │   │   └── postController.js
    │   │   └── commentController.js
    │   ├── middlewares/
    │   │   ├── errorHandler.js
    │   │   ├── responseHandler.js
    │   │   └── auth.js
    │   ├── models/
    │   │   └── User.js
    │   │   └── Post.js
    │   │   └── Comment.js
    │   ├── routes/
    │   │   └── userRoutes.js
    │   │   └── postRoutes.js
    │   │   └── commentRoutes.js
    │   └── app.js
    ├── tests/
    │   ├── unit/
    │   │   └── middlewares/
    │   │       └── auth.test.js
    │   └── integration/
    │       └── routes/
    │           └── comment.test.js
    │           ├── user.test.js
    │           └── post.test.js
    ├── .env
    ├── package.json
    ├── package-lock.json
    ├── README.md
    ├── server.js
    └── structure.txt

## 🚀 Getting Started

Instructions to run the app locally:

```bash
npm install
npm run dev
```
Make sure to configure your `.env` with the necessary variables.


##  API Endpoints
📚 [View full API docs on Postman](https://documenter.getpostman.com/view/41859756/2sB2cbZdq2)

### Auth
- `POST /user/register` – Register a new user
- `POST /user/login` – Log in a user

### User
- `GET /user/profile` – View user profile

###  Posts

-   `POST /posts` – Create a new blog post (protected)
    
-   `GET /posts` – Fetch all blog posts
    
-   `GET /posts/:slug` – Fetch a single post by slug
    
-   `PUT /posts/:slug` – Update post (author only, protected)
    
-   `DELETE /posts/:slug` – Delete post (author only, protected)
    
-   `PATCH /posts/:slug/like` – Toggle like/unlike post (protected)

-   `GET /posts/search` - Search Functionality by "content" or "title"
    

> Each blog post supports `tags`, `likes`, `slug`, and `author` references. Like/unlike action is reflected via `likedByUser` and `likeCount` fields in response.
### Comments

-   **POST /comments** – Create a new comment on a post (protected)
    
-   **GET /comments?post_id={post_id}** – Fetch all comments for a specific post
    
-   **GET /comments/my-comments** – Fetch all comments by the logged-in user (protected)
    
-   **GET /comments/:id** – Fetch a single comment by ID
    
-   **PUT /comments/:id** – Update a comment (author only, protected)
    
-   **DELETE /comments/:id** – Delete a comment (author only, protected)
    
-   **PATCH /comments/:id/like** – Like/Unlike a comment (protected)
---

## 🚀 Extra Features Implemented

While building this project, I went beyond the core requirements and added the following enhancements to showcase my problem-solving and backend development skills:

- **Like/Unlike System** on posts and comments with:
  - Users can **like** and **unlike** both posts and comments.
  - Preventing duplicate likes
  - Dynamic like count
  -  Each comment and post has a **like count**, and the response includes whether the user has liked the item (using `likedByUser` flag).
- **Slug-Based Routing** for posts instead of MongoDB ObjectIds to improve SEO-friendly URLs and cleaner API consumption
- **Comment Management** for posts for better management that includes:
  - Users can **create**, **read**, **update**, and **delete** comments.
    
  -   **View all comments** for a specific post and view all comments by the logged-in user.

- **Postman Collection** fully organized and documented with:
  - Separate folders for each route group
  - Request-level description and example inputs/outputs
  - Shared authorization setup
- **Centralized Error Handling**:
   -   All errors are handled in a single error-handling middleware, improving code readability and maintainability.

-  **Post Controller Refactoring** with modular functions, reusable error/response handlers, and protected routes for data safety

-  **README.md** designed with clear structure, live documentation link, and deployment-ready instructions

These additions reflect my focus on real-world readiness, attention to user experience, and ability to build production-quality APIs.

---
## 🧪 Testing

### Test Strategy
- **Unit Tests:** I have written unit tests for the individual components, like the user authentication middleware, error handling, and controller.
- **Integration Tests:** Comprehensive integration tests have been written for the key API endpoints (POST, GET, PUT, DELETE) for user registration, login, post management, and post interaction (like/dislike).

### Test Coverage
This project includes comprehensive tests to ensure the functionality and reliability of the API. The tests are written using **Jest** and **Supertest**, with a focus on unit and integration testing for the controllers, middlewares, and routes.
- We used **Jest** for running tests and generating coverage reports.
- Our tests cover:
  - **User routes:** Registration, login, and profile fetching.
  - **Post routes:** CRUD operations (Create, Read, Update, Delete), like/unlike functionality.
  - **Authentication:** Ensures the app is secure and only authenticated users can perform certain actions.

#### Running Tests:
To run the tests and see the coverage, run:

    npm test

### Test Coverage Report
After running the tests, the following coverage was achieved:


    ---------------------|---------|----------|---------|---------|--------------------------------------------------                          
    File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s ---------------------|---------|----------|---------|---------|--------------------------------------------------
    All files            |    85.2 |    53.84 |   84.21 |   87.16 |                                                 
     src                 |   88.23 |      100 |       0 |   88.23 | 24,29                                           
     src/controllers     |   80.99 |    60.86 |     100 |   83.18 |     
    commentController.js |      70 |     82.3 |   76.15 |   80.65 | 19,25,38-39,49,99-100
      postController.js  |   78.65 |    55.26 |     100 |   81.48 | 12,15,18,27,42-43,56-57,74,86,97,111,123,128,161
      userController.js  |    87.5 |     87.5 |     100 |    87.5 | 34,66,77,83                                     
     src/middlewares     |    87.5 |    35.29 |      75 |    87.5 |                                                 
      auth.js            |     100 |      100 |     100 |     100 |                                                 
      errorHandler.js    |      40 |        0 |       0 |      40 | 2-6                                             
      responseHandler.js |     100 |       40 |     100 |     100 | 1-9                                             
     src/models          |   93.33 |       50 |     100 |     100 |                                                 
      Post.js            |     100 |      100 |     100 |     100 |                                                 
      User.js            |    90.9 |       50 |     100 |     100 | 34                                              
     src/routes          |     100 |      100 |     100 |     100 |                                                 
      postRoutes.js      |     100 |      100 |     100 |     100 |                                                 
      userRoutes.js      |     100 |      100 |     100 |     100 |                                                 
    ---------------------|---------|----------|---------|---------|--------------------------------------------------

Test Suites: 4 passed, 4 total
Tests:       23 passed, 23 total
Snapshots:   0 total
Time:        11.091 s
Ran all test suites.` 

### Coverage Summary
   
   -   **Overall Test Coverage**: 85.2%
   
   -   **Statements**: 85.2% of the code statements are covered by tests.
   
   -   **Branches**: 53.84% of the code branches (conditional logic) are covered.
   
   -   **Functions**: 84.21% of the functions are covered by tests.
   
   -   **Lines**: 87.16% of the lines are covered by tests.
   
     
