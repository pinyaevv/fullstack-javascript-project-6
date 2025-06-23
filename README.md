### Hexlet tests and linter status:
[![Actions Status](https://github.com/pinyaevv/fullstack-javascript-project-6/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/pinyaevv/fullstack-javascript-project-6/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=pinyaevv_fullstack-javascript-project-6&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=pinyaevv_fullstack-javascript-project-6)

## Application deployed to Railway:  
🔗 [Task Manager on Railway](https://fullstack-javascript-project-6-production-f4f5.up.railway.app)

## Description

Task Manager is a web application for creating, assigning, and tracking tasks. Developed as part of a fullstack JavaScript course on Hexlet.

The project features:

- User authentication and authorization (sign up, log in, log out)
- CRUD operations for tasks, statuses, and labels
- Assigning tasks to users
- Filtering tasks by status, executor, label, and author
- Multilingual interface (English and Russian)
- Server-side rendering using Pug templates
- RESTful routing and form validation

## Technologies Used

- **Backend:** Node.js, Fastify, Objection.js, PostgreSQL
- **Frontend:** Bootstrap, Pug
- **Authentication:** Passport.js, cookies
- **Testing:** Jest, Supertest
- **Linting:** ESLint
- **CI/CD:** GitHub Actions, Railway, SonarCloud

## Setup

Clone the repository and run the following commands:

```bash
make install
make db-migrate
make build
make start