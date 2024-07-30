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

    } catch(Error: any) {
        console.log(Error);
    }
}

async function readUserReviewsData(path: string): Promise<void>{
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
          .pipe(csvParser())
          .on('data', (row: UserReview) => {
                    const { quote, ...updatedRow} = row;
                    insertRow(updatedRow);
                    })
          .on('end', () => resolve())
          .on('error', (Error) => reject(Error));
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