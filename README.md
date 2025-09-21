# Job Board

A simple job board web application with full CRUD functionality built with React, Node.js, and PostgreSQL.

## Features

- Create, Read, Update, Delete job postings
- Basic responsive UI with React
- RESTful API with Node.js and Express
- PostgreSQL database for storing job data

## Tech Stack

- **Frontend:** React
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Deployment:** AWS (planned)

## Setup Instructions

### 1. Clone the repository
git clone <your-repo-url>
cd <repo-folder>

### 2. Backend Setup
cd backend
npm install

Create a `.env` file with the following:
DATABASE_URL=postgres://<username>:<password>@<host>:<port>/<database>
PORT=5000

Start backend server:
npm run dev

### 3. Frontend Setup
cd frontend
npm install
npm start

Open http://localhost:3000 in your browser.

## Deployment (Planned)

- **Backend:** Deploy Node.js API using AWS Elastic Beanstalk  
- **Database:** Use Amazon RDS for PostgreSQL  
- **Frontend:** Host React build on AWS S3 + CloudFront  
- **Domain & HTTPS:** Route 53 + AWS Certificate Manager  

## Contributing

Feel free to submit issues or pull requests. One commit a day keeps the momentum going!

## License

MIT
