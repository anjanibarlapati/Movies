import express from 'express';
import { Movies } from '../Models/movies';

export const moviesRouter = express.Router();


// To get all distinct movies names and their count

moviesRouter.get('/distinctMovies', async (req, res) => {
    try {

        const result = await Movies.distinct('movieTitle');
        const count =await Movies.distinct('movieTitle').countDocuments();

        if (result.length === 0) {
            return res.status(404).send("No movies found");
        } 
        console.log(result);
        res.json({Movies: result , Count: count});

    } catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
});

// Highest Ranked Movie

moviesRouter.get('/highestRankedMovie', async (req, res) => {
    try {
        const result = await Movies.findOne({}).sort({movieRank: 1}).limit(1);
        if (!result) {
            return res.status(404).send("No movies found ");
        } 
        res.json(result);

    } catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
});

// Lowest Ranked Movie

moviesRouter.get('/lowestRankedMovie', async (req, res) => {
    try {
        const result = await Movies.findOne({}).sort({movieRank: -1}).limit(1);
        if (!result) {
            return res.status(404).send("No movies found ");
        } 
        res.json(result);

    } catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
});

// Movie with highest critic score

moviesRouter.get('/highestCriticScoreMovie', async (req, res) => {
    try {
        const result = await Movies.findOne({}).sort({critic_score: 1}).limit(1);
        if (!result) {
            return res.status(404).send("No movies found ");
        } 
        res.json(result);

    } catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
});

// Movie with lowest audience score

moviesRouter.get('/lowestAudienceScoreMovie', async (req, res) => {
    try {
        const result = await Movies.findOne({}).sort({audience_score: -1}).limit(1);
        if (!result) {
            return res.status(404).send("No movies found ");
        } 
        res.json(result);

    } catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
});


// Highest and Lowest Original Score using facet and project. It gives highest and lowest documents

moviesRouter.get('/highestAndLowestOrignalScoreOfAMovie1/:name', async (req, res) => {
    try {
        const result = await Movies.aggregate([
            {
                $match: { movieTitle: req.params.name } 
            },
            {
                $lookup: {
                    from: 'criticreviews',
                    localField: '_id',
                    foreignField: 'movieId',
                    as: 'criticDetails'
                }
            },
            {
                $unwind: { path: '$criticDetails' }
            },
            {
                $facet: {
                    highestScore: [
                        { $sort: { 'criticDetails.originalScore': -1 } },
                        { $limit: 1 }, 
                        //{ $project: { _id: 0, highestScore: '$criticDetails.originalScore' } } 
                    ],
                    lowestScore: [
                        { $sort: { 'criticDetails.originalScore': 1 } }, 
                        { $limit: 1 }, 
                        //{ $project: { _id: 0, lowestScore: '$criticDetails.originalScore' } } 
                    ]
                }
            },
            {
                $project: {
                    _id: 0,
                    highestScore: 1, // { $arrayElemAt: ['$highestScore.highestScore', 0] },
                    lowestScore: 1  //  { $arrayElemAt: ['$lowestScore.lowestScore', 0] }
                }
            }
        ]);

        if (result.length === 0) {
            return res.status(404).send("No movie found with name "+ req.params.name);
        } 
        res.json(result);

    } catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
});


// Highest and Lowest Original Score using group and project


moviesRouter.get('/getHighestAndLowestOrignalScoreOfAMovie2/:name', async( req, res)=> {
    try{
        const result = await Movies.aggregate([
            {
               $match: { movieTitle: req.params.name}
            },
            {
                $lookup: {
                   from: 'criticreviews',
                   localField: '_id',
                   foreignField: 'movieId',
                   as: 'criticDetails'
                } 
            }, 
            {$unwind: '$criticDetails'},  // required or else it cannot access '$criticDetails.originalScore' in group and it takes all 
            {
                $group: {
                    _id: '$movieTitle',  
                    highest: {$max : '$criticDetails.originalScore'},
                    lowest: {$min: '$criticDetails.originalScore'}
                }
            },
            {
                $project: {
                    _id: 0,
                    movieTitle: '$_id',  // renameing _id to movieTitle and the fields specified in the last stage will be included in the output. 
                                        // To customise o/p we need to use project
                    highest: 1,
                    lowest: 1,
                }
            }

        ]);
        if (result.length === 0) {
            return res.status(404).send("No movie found with name "+ req.params.name);
        } 
        res.json(result);

    }
    catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
})


// Highest Original Score using sort and limit

moviesRouter.get('/highestOrignalScoreOfAMovie/:name', async(req, res)=> {
        try{
            const result = await Movies.aggregate([
                {
                   $match: { movieTitle: req.params.name}
                },
                {
                    $lookup: {
                       from: 'criticreviews',
                       localField: '_id',
                       foreignField: 'movieId',
                       as: 'criticDetails'
                    } 
                }, 
                { $unwind: '$criticDetails' },
                {
                    $sort: {'criticDetails.originalScore': -1}  // 1 for lowest originalScore
                },
                {
                    $limit:1
                }
            ]);
            res.json(result);
        }
        catch(Error: any) {
            res.status(500).json({message: Error.message});
        }
})


// Get avg originalScore of all movies from all its critic reviews

moviesRouter.get('/avgOriginalScoreOfAllMovies', async(req, res) => {

    try{
        const result = await Movies.aggregate([
            {
                $lookup: {
                     from: 'criticreviews',
                     localField: '_id',
                     foreignField: 'movieId',
                     as: 'CriticDetails'
                },
    
            },
            {
                $unwind: '$CriticDetails' 
            },
            {
               $group: {
                   _id: '$CriticDetails.movieId',
                   movieDetails: {$first: '$$ROOT'},
                   average: {$avg: '$CriticDetails.originalScore' }         
               } 
            },
            {
                $project: {
                    _id: 0,
                    movieDetails: 1,
                    average: 1
                }
            }
    
        ])

        res.json(result);
    }
    catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
})

// All user reviews of a movie

moviesRouter.get('/allUserReviewsofAMovie/:name', async(req, res)=> {
    try{
        const result = await Movies.aggregate([
            {
                $match: {movieTitle: req.params.name}
            },
            {
                $lookup: {
                    from: 'userreviews',
                    localField: '_id',
                    foreignField: 'movieId',
                    as: 'userDetails'
                }
        
            },
            {
                $unwind: '$userDetails'
            },
            {
                $project: {
                    _id: 0, 
                    movieTitle:1,
                    userDetails: 1
                }
            }
           ])

          res.json(result);
    }
    catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
})
