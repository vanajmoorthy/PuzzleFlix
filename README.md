# PuzzleFlix

Group 15's CS3099 SWE final project.
A puzzle playing website where you can play sudoku, multple eights puzzles, and the eight queens puzzle.

The git repository for this project can be found at [https://gitlab.cs.st-andrews.ac.uk/cs3099group15/project-code](https://gitlab.cs.st-andrews.ac.uk/cs3099group15/project-code)

### Deployment

-   ssh `<your_cs_username>.host.cs.st-andrews.ac.uk`
-   ssh `cs3099user15@cs3099user15.host.cs.st-andrews.ac.uk`
-   Clone repo or cd ~/Documents/project-code
-   npm install in both the puzzleflix-client and puzzleflix-server folders
-   `git pull` if you haven't just cloned or have an old version
-   ./build.sh in both folder
-   Access at [cs3099user15.host.cs.st-andrews.ac.uk](cs3099user15.host.cs.st-andrews.ac.uk) whilst on the school of computer science network.

### Running locally for development

-   Clone repo
-   `npm install` in both the puzzleflix-client and puzzleflix-server folders
-   Run a proxy through the school network to access the database at host server with `ssh cs3099user15.host.cs.st-andrews.ac.uk -L 3306:localhost:3306 -N`
-   `npm run dev` in both the puzzleflix-client and puzzleflix-server folders

### Access to the database (sudo user name cs3099user15):

-   SSH to the pseudo user's host server with `ssh <your-cs-userame>@cs3099user15.host.cs.st-andrews.ac.uk`
-   Become the pseudo user with `sudo -u cs3099user15 bash -l`
-   Run `cd` to change to the pseudo user's home directory
-   Then run the mysql-initial-settings command to display the MariaDB password for the pseudo user with `mysql-initial-settings`

### For command line access on your host server run:

`/usr/bin/mysql --defaults-extra-file=/var/cs/mysql/cs3099user15/my.cnf -u cs3099user15`

Check number of line of code by running `cloc--exclude-list-file=.clocignore .`

### Dependencies

#### Client

-   axios
-   react
-   vite
-   react-confetti
-   react-circular-progressbar
-   server

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
