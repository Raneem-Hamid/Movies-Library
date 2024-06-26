const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const axios = require('axios');
require('dotenv').config();
// const {Client}= require('pg');
// const dbURL = `postgres://raneem:0000@localhost:5432/movies`;
// const client = new Client(dbURL);
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const movieData = require('./Movie Data/data.json');
const port = process.env.PORT;
const apiKey = process.env.API_KEY;
/********************** Deploying Part *****************************/
const DataBase=process.env.PG_DATABASE;
const UserName=process.env.PG_USER;
const password=process.env.PG_PASSWORD;
const Host=process.env.PG_HOST;
const PORT=process.env.PG_PORT;
const {Client}= require('pg');
const dbURL = `postgres://${UserName}:${password}@${Host}:${PORT}/${DataBase}`;
const client = new Client(dbURL);

// console.log(apiKey);
/***************************************Routs ***********************************/
app.get("/", homePageHandler);
app.get("/favorite", favoritePageHandler);
app.get("/trending", trendingPageHandler);
app.get("/search", searchHandler);
app.get("/upcoming", handelUpcoming)
app.get("/nowPlaying", handelNowPlaying)
app.post("/addMovie", addMovieHandler)
app.get("/getMovies",getMoviesHandler)
app.put("/UPDATE/:id",updateHandler)
app.delete("/DELETE/:id",deleteHandler)
app.get("/getMovie/:id",getOneMovieHandler)
// app.get('*', error404Handler)


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


function addMovieHandler(req,res) {
    console.log(req.body);
    const {id,title,release_date,poster_path,overview,comment}=req.body;
    const sql = `INSERT INTO movies
    VALUES ($1, $2, $3,$4,$5,$6);`
    const values = [id,title,release_date,poster_path,overview,comment];
    client.query(sql,values).then(()=>{
        res.status(201).send("Data saved successfully to data base");

    }).catch()
}


function getMoviesHandler(req,res) {
    const sql = `SELECT * FROM movies`;
    client.query(sql).then((result)=>{
        const data = result.rows;
        res.json(data);
    }).catch()
}

function updateHandler(req,res) {
    console.log(req.params);
    let id = req.params.id;
    let {title ,release_date ,poster_path ,overview ,comment } = req.body;
    let sql = `UPDATE movies
    SET id = $1, title = $2,release_date= $3,poster_path=$4,overview=$5,comment=$6
    WHERE id = $1;`;
    let values = [id,title ,release_date ,poster_path ,overview ,comment]
    client.query(sql,values).then(()=>{
res.send("Successfully updated");
    }).catch()
}

function deleteHandler(req,res) {
    let id = req.params.id;
    let sql = `DELETE FROM movies WHERE id=$1;`;
    let values = [id];
    client.query(sql,values).then(()=>{
        res.send('successfully deleted');
    }).catch()
}

function getOneMovieHandler(req,res) {
    let id = req.params.id;
    const sql = `SELECT * FROM movies WHERE id=$1`;
    let values = [id];
    client.query(sql,values).then((result)=>{
        const data = result.rows;
        res.json(data);
    }).catch()
}

const error500 = (err, req, res,next) => {

    res.status(500).send({
        status: 500,
        responseText: "Server Error: Something went wrong"
    })
}



function error404Handler(req, res ,next ) {
    res.status(404).send("page not found 404!");
}


app.use(error404Handler);
app.use(error500);
/******************************************lesten port */
client.connect().then(()=>{
    app.listen(port, () => {
    console.log(`Iam listen for ${port}`)
});
}).catch()


