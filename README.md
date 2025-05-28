
# Contact Form Submission App

This is a full-stack web application that implements a functional contact form. Users can submit their contact information and a message, which is stored in an SQLite database. The system includes a simple interface for viewing and deleting submissions.

## Built With

- **Frontend**: HTML, CSS (Bootstrap), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite

## Project Structure

```
public_html/
├── assets/
│   ├── images/
│   │   ├── home.jpg
│   │   ├── logo.svg
│   │   └── submissions.jpg
│   └── js/
│       ├── contact.js
│       ├── load-form.js
│       └── load-header.js
├── header.html
├── index.html
├── style.css
├── submissions.html
.gitignore
createDB.js
package.json
package-lock.json
server.js
```

## Features

- Client-side and server-side validation and sanitisation
- Submissions stored securely in SQLite
- View all submissions on a dedicated page
- Delete functionality for individual entries

## Getting Started

1. Clone the repository:

   ```bash
   git clone <your-repo-url>
   cd <project-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the SQLite database:

   ```bash
   node createDB.js
   ```

4. Start the server:

   ```bash
   node server.js
   ```

5. Open your browser at [http://localhost:3000](http://localhost:3000)

## Notes

- Submissions can be viewed and deleted at `submissions.html`.

## Author

Natalia Pakhomova