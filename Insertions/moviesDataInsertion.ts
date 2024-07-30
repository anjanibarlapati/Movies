import { Movies } from "../Models/movies";
import nconf from 'nconf';
import fs from 'fs';
import csvParser from 'csv-parser';

nconf.argv().file('config.json');

type Movie = {
    movieId: string;
    movieTitle: string;
    movieYear: number;
    movieURL: string;
    movieRank: number; 
    critic_score: string;
    audience_score: string; 
};

async function readMoviesData(path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path)
          .pipe(csvParser())
          .on('data', async (row: Movie) => {
                   try {
                         await Movies.create(row);
                   } catch(Error: any) {
                         console.log(Error);
                   }              
          })
          .on('end', () => { resolve()})
          .on('error', (Error) => reject(Error));
      }); 
}

export async function insertMoviesData() {

    try{       
        const moviesDataPath: string = nconf.get('moviesDataPath');

        if(!moviesDataPath ) {
            throw new Error("Movies data path is not defined")
        }
       
        await readMoviesData(moviesDataPath);
        console.log("Inserted Movies Data successfully");

    //    console.log(moviesData.length);

    //    const uniqueElements = new Set(moviesData.map((item: any) => item['movieYear']));

    //    const uniqueArray = Array.from(uniqueElements);
    //    console.log(uniqueArray.sort());


    //    const hasEmptyValues = uniqueArray.some(value => {
    //        if (typeof value === 'string') {
    //            return !value || value.trim() === "";
    //        }
    //        return !value;
    //    });
    //    console.log(hasEmptyValues);
    //    console.log(uniqueElements);
    //    console.log(uniqueElements.size);

    } catch(Error: any) {
        console.log("Error while inserting Movies data", Error);
    }    
};

