import nconf from 'nconf';
import fs from 'fs';
import csvParser from 'csv-parser';
import { UserReviews } from '../Models/userReviews';
import { Movies } from '../Models/movies';

nconf.argv().file('config.json');

type UserReview = {
    movieId: object;
    rating: number;
    quote?:string;
    reviewId: string;
    isVerified: string;
    isSuperReviewer: string;
    hasSpoilers: string;
    hasProfanity: string;
    score: number;
    creationDate: Date;
    userDisplayName: string;
    userRealm: string;
    userId: string;
}

async function insertRow(row: UserReview) {
    try{
        const id = await Movies.findOne({movieId: row.movieId}, '_id');
        if(id == null) 
            throw new Error("No such movie with movieId: "+ row.movieId);
        row.movieId = id._id;
        await UserReviews.create(row);
        console.log("inserted");
    } catch(Error: any) {
        console.log(Error);
    }
}

async function readUserReviewsData(path: string): Promise<void>{
    return new Promise((resolve, reject) => {
          const fileStream = fs.createReadStream(path);
          const csvPipe = fileStream.pipe(csvParser());
           let count =0;
          csvPipe.on('data', async (row: UserReview) => {
                    console.log("Processing Record" + (++count) + ": " +  row);
                    csvPipe.pause();
                    try{
                        const { quote, ...updatedRow} = row;
                        await insertRow(updatedRow);
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
};

export async function insertUserReviewsData(): Promise<void>{

    try{
        const userReviewsDataPath: string = nconf.get('userReviewsDataPath');

        if(!userReviewsDataPath) {
           throw new Error("User Reviews data path is not defined")
        }
        
        await readUserReviewsData(userReviewsDataPath);
        console.log("Inserted User Reviews data successfully");

    } catch(Error: any) {
        console.log("Error while inserting User Reviews Data", Error);
    }

};