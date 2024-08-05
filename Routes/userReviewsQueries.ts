import  express  from "express";
import { Movies } from "../Models/movies";
import { UserReviews } from "../Models/userReviews";


export const userReviewsRouter = express.Router(); 

// All Reviews of a user

userReviewsRouter.get('/reviewsOfAUser/:id', async(req, res) => {
       try{
           const result = await UserReviews.find({userId: req.params.id}).populate('movieId');
           res.json(result);

       } catch(Error: any) {
            res.status(500).json({message: Error.message})
       }
})


// Distribution of score from all user reviews for a specific movie.

userReviewsRouter.get('/scoreDistributionOfAMovie/:id', async(req, res) => {
    try{
        const result = await Movies.aggregate([
            {
                $match: {movieId: req.params.id}
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
                $group: {
                    _id: '$userDetails.score',
                    count: {$sum: 1}
                }
            },
            {
                $project: {
                    _id: 0,
                    score: '$_id',
                    count: '$count',
                }
            },
            {
                $sort: {'score': 1}
            }
        ]);

        res.json(result);

    } catch(Error: any) {
         res.status(500).json({message: Error.message})
    }
})


// Distribution of rating from all user reviews for a specific movie.


userReviewsRouter.get('/ratingDistributionOfAMovie/:id', async(req, res) => {
    try{

        const result = await Movies.aggregate([
            {
                $match: {movieId: req.params.id}
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
                $group: {
                    _id: '$userDetails.rating',
                    count: {$sum: 1}
                }
            },
            {
                $project: {
                    _id: 0,
                    rating: '$_id',
                    count: '$count',
                }
            },
            {
                $sort: {'rating': 1}
            }
   ]);
    
    res.json(result);

    } catch(Error: any) {
         res.status(500).json({message: Error.message})
    }
})