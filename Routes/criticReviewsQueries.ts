import express from 'express';
import { Movies } from '../Models/movies';

export const criticReviewsRouter = express.Router();

// Distribution of original scores from all critic reviews for a specific movie.

criticReviewsRouter.get('/originalScoreDistributionOfAMovie/:id', async(req, res) => {
      try{
        const result = await Movies.aggregate([
            {
                $match: {movieId: req.params.id}
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
                $unwind: '$criticDetails'
            },
            {
                $group: {
                    _id: '$criticDetails.originalScore',
                    count: {$sum: 1}
                }
            },
            {
                $project: {
                    _id: 0,
                    originalScore: '$_id',
                    count: '$count',
                }
            },
            {
                $sort: {'originalScore': 1}
            }
       ]);
       res.json(result);

      }  catch(Error: any) {
        res.status(500).json({message: Error.message});
    }
});
