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
        const fileStream = fs.createReadStream(path);
        const csvPipe = fileStream.pipe(csvParser());
        let count =0;
          csvPipe.on('data', async (row: Movie) => {
                   console.log("Processing Record" + (++count) + ": " +  row);
                   csvPipe.pause();
                   try {
                         await Movies.create(row);
                         console.log("inserteddd");
                   } catch(Error: any) {
                         console.log(Error);
                   }  
                   finally {
                    csvPipe.resume();
                }        
          })
          csvPipe.on('end', () => { resolve()})
          csvPipe.on('error', (Error) => reject(Error));
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

