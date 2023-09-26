process.env.APP_ENVIRONMENT = 'TEST';
const db = require('../database');

describe('Test the test database with the database functions from database', () => {

  /*    // Insert some test data
  await pool.query(`
  INSERT INTO users (userid, username, fname, sname, email, password, accountelevation, groupcreated, avatar, lastloggedin, online, datecreated, bio, xp, private)
  VALUES ('user1', 'user1', 'John', 'Doe', 'john.doe@example.com', 'password1', 1, 1, 'avatar1', '2022-01-01', 1, '2022-01-01', 'bio1', 100, 0);
  ("user2", "user2_username", "User2", "LastName2", "user2@example.com", "password2", 0, 1, "avatar2.jpg", "2023-03-22", 0, "2023-03-22", "User2 bio", 50, 1),
("user3", "user3_username", "User3", "LastName3", "user3@example.com", "password3", 1, 2, "avatar3.jpg", "2023-03-22", 0, "2023-03-22", "User3 bio", 200, 0);
  
INSERT INTO users (userid, username, fname, sname, email, password, accountelevation, groupcreated, avatar, lastloggedin, online, datecreated, bio, xp, private) VALUES 
("author1", "author1_username", "Author1", "LastName1", "author1@example.com", "password1", 1, 1, "avatar1.jpg", "2023-03-22", 1, "2023-03-22", "Author1 bio", 100, 0),
("user2_username", "user2_username", "User2", "LastName2", "user2@example.com", "password2", 0, 1, "avatar2.jpg", "2023-03-22", 0, "2023-03-22", "User2 bio", 50, 1),
("user3_username", "user3_username", "User3", "LastName3", "user3@example.com", "password3", 1, 2, "avatar3.jpg", "2023-03-22", 0, "2023-03-22", "User3 bio", 200, 0);

          INSERT INTO puzzles (puzzleid, puzzlename, puzzledata, difficulty, solution, datepublished, author, puzzletype, titleCSS, puzzleRating, puzzleImage)
          VALUES ('puzzle1', 'Puzzle 1', 'data1', 1, 'solution1', '2022-01-01', 'author1', 'type1', 'titleCSS1', 4.5, 'image1');
          ("puzzle2", "Puzzle 2", "puzzledata2", 2, "solution2", "2023-03-21", "user2_username", "type2", "titleCSS2", 3.0, "image2.jpg"),
("puzzle3", "Puzzle 3", "puzzledata3", 1, "solution3", "2023-03-20", "user3_username", "type3", "titleCSS3", 2.5, "image3.jpg");
("puzzle4", "Puzzle 4", "puzzledata4", 1, "solution4", "2023-03-20", "user3", "type4", "titleCSS4", 2.5, "image4.jpg");

          INSERT INTO user_puzzle (userid, puzzleid, puzzledata, issolved, hassolved, date, previousscores, previoustimes, userrating)
          VALUES ('user1', 'puzzle1', 'data1', 1, 1, '2022-01-01', 'scores1', 'times1', 4);
          ("user2", "puzzle2", "puzzledata2", 1, 1, "2023-03-21", "8,6,4", "2:20,3:10,4:30", 3),
("user3", "puzzle3", "puzzledata3", 0, 0, "2023-03-20", NULL, NULL, NULL);
          
          INSERT INTO comments (commentid, userid, puzzleid, dateposted, commentdata)
          VALUES ('comment1', 'user1', 'puzzle1', '2022-01-01', 'comment1');
          `);
          ("comment2", "user2", "puzzle2", "2023-03-21", "Comment 2"),
("comment3", "user3", "puzzle3", "2023-03-21", "Comment 3");
          */
         
         // test user
         test('it should retrieve the correct user with a username', () => {
           const username = "user1";
           const values = [username];
           
          db.getUsers(values,  async (err, result)=> {

             result = eval(JSON.parse(JSON.stringify(result)));
             expect(result[0].username).toBe(username);
            });
          });
          
          

          // Get comments
          test("it should come back with the comment", () => {
            const puzzleid = "puzzle1";
            const values = [puzzleid];
           
            db.getComments(values, async (err, result)=> {

              result = eval(JSON.parse(JSON.stringify(result)));
              expect(result[0].comment).toBe("comment1");
            });
          });
          

        });