import { dbConnection } from "./Configuration/db";
import { insertMoviesData } from "./Insertions/moviesDataInsertion";
import { insertCriticReviewsData } from "./Insertions/criticsDataInsertion";
import { insertUserReviewsData } from "./Insertions/usersDataInsertion";
import express from 'express';
import {moviesRouter} from './Routes/moviesQueries';
import { criticReviewsRouter } from "./Routes/criticReviewsQueries";
import { userReviewsRouter } from "./Routes/userReviewsQueries";

const app = express();

async function start() {

    try {

        await dbConnection();
        await insertMoviesData();
        await insertCriticReviewsData();
        await insertUserReviewsData();
        
    } catch(Error: any) {
        console.log(Error);
    }
}

start();


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


app.use('/',moviesRouter);
app.use('/',criticReviewsRouter);
app.use('/', userReviewsRouter)


const PORT = process.env.PORT || 4320;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
