
process.env.APP_ENVIRONMENT = 'TEST';
const db = require('./database');




describe('Test the mock database with the database functions from database', () => {
  
          /*    // Insert some test data
          await pool.query(`
          INSERT INTO users (userid, username, fname, sname, email, password, accountelevation, groupcreated, avatar, lastloggedin, online, datecreated, bio, xp, private)
          VALUES ('user1', 'user1', 'John', 'Doe', 'john.doe@example.com', 'password1', 1, 1, 'avatar1', '2022-01-01', 1, '2022-01-01', 'bio1', 100, 0);
          
          INSERT INTO puzzles (puzzleid, puzzlename, puzzledata, difficulty, solution, datepublished, author, puzzletype, titleCSS, puzzleRating, puzzleImage)
          VALUES ('puzzle1', 'Puzzle 1', 'data1', 1, 'solution1', '2022-01-01', 'author1', 'type1', 'titleCSS1', 4.5, 'image1');
          
          INSERT INTO user_puzzle (userid, puzzleid, puzzledata, issolved, hassolved, date, previousscores, previoustimes, userrating)
          VALUES ('user1', 'puzzle1', 'data1', 1, 1, '2022-01-01', 'scores1', 'times1', 4);
          
          INSERT INTO comments (commentid, userid, puzzleid, dateposted, commentdata)
          VALUES ('comment1', 'user1', 'puzzle1', '2022-01-01', 'comment1');
          `);
          */
         
         // test user
         test('it should retrieve the correct user with a username', () => {
           const username = "user1";
           const values = [username];
           
          db.getUsers(values, async (err, result)=> {

             result = eval(JSON.parse(JSON.stringify(result)));
             expect(result[0].username).toBe(username);
            });
          });
          
          // test get puzzle o
          test('it should retrieve the puzzle or the progress', () =>{
            const puzzleId = "puzzle1";
            const userid = "user1";
            const values = [puzzleId,userid];
            db.resumeOrNew(values, async (err,result)=>{

            });
          });

          // test get puzzle that does not have progress
          test('it should retrieve a puzzle even tho no progress exists', () =>{
            const puzzleId = "puzzle1"
            const userid = "user1";
            const values = [puzzleId,userid];
            db.resumeOrNew(values, async (err,result)=>{

            });
          });

          // Get comments
          test("comment comes back cool", () => {
            const puzzleid = "puzzle1";
            const values = [puzzleid];
           
            db.getComments(values, async (err, result) => {

              result = eval(JSON.parse(JSON.stringify(result)));
              expect(result[0].comment).toBe("comment1");
            });
          });
          
          
        });