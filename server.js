const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const axios = require('axios');
require('dotenv').config();
const movieData = require('./Movie Data/data.json');
const port = process.env.PORT;
const apiKey = process.env.API_KEY;
// console.log(apiKey);
/***************************************Routs ***********************************/
app.get("/", homePageHandler);
app.get("/favorite", favoritePageHandler);
app.get("/trending", trendingPageHandler);
app.get("/search", searchHandler);
app.get("/upcoming", handelUpcoming)
app.get("/nowPlaying", handelNowPlaying)
app.get('*', error404Handler)


/*****************************************constructor***********************/

function Movie(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

function TrendingMovie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

/********************************* Functions ************************************/
function homePageHandler(req, res) {
    try {

        let oneMovie = new Movie(movieData.title, movieData.poster_path, movieData.overview);
        res.json(oneMovie);

    }
    catch (err) {
        error500(err, req, res);
    }

};


function trendingPageHandler(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}&language=en-US`;

    axios.get(url)
        .then(result => {
            let movies = result.data.results.map(trend => {
                return new TrendingMovie(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview)

            })

            res.send(movies);

        })
        .catch(error => {
            console.log(error);
        });
}



function favoritePageHandler(req, res) {

    try {
        res.send('Welcome to Favorite Page');
    }
    catch (err) {
        error500(err, req, res);
    }


};

function searchHandler(req, res) {
    let movieName = req.query.name;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}`;

    axios.get(url)
        .then(result => {

            res.send(result.data.results);

        })
        .catch(error => {
            console.log(error);
        });
}

function handelUpcoming(req, res) {
    const url = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}&language=en-US&query=The&page=1`
    axios.get(url)
        .then(result => {
            res.send(result.data.results);
        })
        .catch(error => {
            console.log(error);
        });

}

function handelNowPlaying(req, res) {
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&query=The&page=1`

    axios.get(url)
        .then(result => {
            res.send(result.data.results);
        })
        .catch(error => {
            console.log(error);
        });
}


const error500 = (err, req, res) => {
    res.status(500).send({
        status: 500,
        responseText: "Server Error: Something went wrong"
    })
}

function error404Handler(req, res) {
    res.status(404).send("page not found 404!");
}


/******************************************lesten port */

app.listen(port, () => {
    console.log(`Iam listen for ${port}`)
});

