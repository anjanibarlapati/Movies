import { CriticReviews } from "../Models/criticReviews";
import nconf from 'nconf';
import fs from 'fs';
import csvParser from 'csv-parser';
import { Movies } from "../Models/movies";

nconf.argv().file('config.json');

type CriticReview = {  
    reviewId: number;
    creationDate: Date;
    criticName?: string;
    reviewState: 'fresh' | 'rotten';
    isFresh: 'True' | 'False';
    isRotten: 'True' | 'False';
    isRtUrl: 'True' | 'False' | '';
    isTopCritic: 'True' | 'False';
    publicationUrl: string;
    publicationName: string;
    reviewUrl: string;
    quote: string;
    scoreSentiment: string;
    originalScore: string;
    movieId: object;
}

async function insertRow(row: CriticReview) {
    try{
        const id = await Movies.findOne({movieId: row.movieId}, '_id');
        if(id === null) 
            throw new Error("No such movie with movieId: "+ row.movieId);
        row.movieId = id._id;
        await CriticReviews.create(row);

    } catch(Error: any) {
        console.log(Error);
    }
}

async function readCriticReviewsData(path: string): Promise<void>{
    return new Promise((resolve, reject) => {

          const fileStream = fs.createReadStream(path);
          const csvPipe = fileStream.pipe(csvParser());
           let count =0;
          csvPipe.on('data', async (row: CriticReview) => {
                    console.log("Processing Record" + (++count) + ": " +  row);
                    csvPipe.pause();
                    try{
                        await insertRow(row);
                        console.log("inserteddd");
                    }
                    catch(Error) {
                        console.log(Error);
                    }
                    finally {
                        csvPipe.resume();
                    }

            })
            csvPipe.on('end', () => resolve())
            csvPipe.on('error', (Error: any) => reject(Error));
      }); 
}

export async function insertCriticReviewsData(): Promise<void>{

    try{
        const criticReviewsDataPath: string = nconf.get('criticReviewsDataPath');

        if(!criticReviewsDataPath) {
           throw new Error("Critic Reviews data path is not defined")
        }
        
    await readCriticReviewsData(criticReviewsDataPath);
    console.log("Inserted Critc Reviews data successfully"); 

    } catch(Error: any) {
        console.log("Error while inserting Critic Reviews Data", Error);
    }

};
