# PuzzleFlix

[Demo](https://puzzleflix.vanaj.io)

A puzzle playing website where you can play sudoku, multiple eights puzzles, and the eight queens puzzle.

This was my sub-honours year long software engineering final project completed for my 3rd year at the University of St Andrews.
Developed by a team of 5 in a simulated software engineer environment using Agile and SCRUM management techniques.

Awarded a grade of a first.

### Deployment

-   Clone repo 
-   npm install in both the puzzleflix-client and puzzleflix-server folders
-   `git pull` if you haven't just cloned or have an old version
-   ./build.sh in both folder


### Running locally for development

-   Clone repo
-   `npm install` in both the puzzleflix-client and puzzleflix-server folders
-   Run a MariaDB server on the default port of `3306`
-   `npm run dev` in both the puzzleflix-client and puzzleflix-server folders

Check number of line of code by running `cloc --exclude-list-file=.clocignore .`

### Dependencies

#### Client

-   axios
-   react
-   vite
-   react-confetti
-   react-circular-progressbar

#### Server

-   axios
-   bcrypt
-   cookie-parser
-   cors
-   pg
-   uuid
-   dotenv
-   nodemon
-   node-fetch
-   mysql
-   jest
