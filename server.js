const express = require('express');
const app = express();
const movieData = require('./Movie Data/data.json');
/***************************************Routs ***********************************/

app.get("/",homePageHandler);
app.get("/favorite",favoritePageHandler);
app.get('*',error404Handler)


/*****************************************constructor***********************/

function Movie(title,poster_path,overview) {
    this.title=title;
    this.poster_path=poster_path;
    this.overview=overview;
}

/********************************* Functions ************************************/
function homePageHandler(req,res) {
    try{

    let oneMovie = new Movie(movieData.title,movieData.poster_path,movieData.overview);
    res.json(oneMovie);

    }
    catch(err){
        error500(err,req,res);
    }
    
};



function favoritePageHandler(req,res) {

    res.send('Welcome to Favorite Page');

    
};


const error500 =(error=>{
    res.status(500).send('internal server error')
})



function error404Handler (req,res){
res.status(404).send("page not found 404!");
}


/******************************************lesten port */

app.listen(8080,()=>{
    console.log('Iam listen for 8080 port')
});