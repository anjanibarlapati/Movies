import { dbConnection } from "./Configuration/db";
import { insertMoviesData } from "./Insertions/moviesDataInsertion";
import { insertCriticReviewsData } from "./Insertions/criticsDataInsertion";
import { insertUserReviewsData } from "./Insertions/usersDataInsertion";

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
