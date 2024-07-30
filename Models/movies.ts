import mongoose from 'mongoose';

const moviesSchema = new mongoose.Schema({
     
    movieId: {
        type: String,
        required: true,
        unique: true
    },
    movieTitle: {
        type: String,
        required: true,
        unique: true
    },
    movieYear: {
        type: Number,
        required: true,
    },
    movieURL: {
        type: String,
        required: true,
        unique: true,
        validator: {
            validate: function(value: string){
                const urlPattern = /^https?:\/\/([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(.*)?$/;
                return urlPattern.test(value);
            },
            message: 'Invalid URL format for movieURL'
        }  
    },
    movieRank: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 100
    },
    critic_score: {
        type: Number,
        //type: String,
        required: true,
        set: function(value: string) {
            return Number(value.slice(0,-1))
       }
    },
    audience_score: {
        type: Number,
        //type: String,
        required: true,
        set: function(value: string) {
             return Number(value.slice(0,-1))
        }
    }

});

export const Movies = mongoose.model('movie', moviesSchema);
