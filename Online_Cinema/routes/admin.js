let User = require('../models/user').User;
let Genre = require('../models/genre').Genre;
let Movie = require('../models/movie').Movie;
let Review = require('../models/review').Review;
const getmoviedata = require('../libs/getmoviedata');
const fs = require("fs");
var http = require('http');
exports.add = function(req, res, next) {
    res.render("addmovie.hbs", {});
};

exports.edit = function(req, res, next) {
    res.render("editmovie.hbs", {});
};

exports.block = function(req, res, next) {
    res.render("blockuser.hbs", {});
};

exports.getdata = function(req, res, next) {
    getmoviedata.get(req.body)
        .then((info) => {
            return (Genre.getTitlesByOrigTitles(info.imdb_data.Genre.split(', ')))
                .then((genres => {
                    let data = {};

                    data.title = info.kinopoisk_data.title;
                    data.imdb_id = info.imdb_data.imdbID;
                    data.kinopoisk_id = info.kinopoisk_data.kinopoisk_id;
                    data.title_orig = info.imdb_data.Title;
                    data.year = info.imdb_data.Year.slice(0, 4);
                    data.url = info.imdb_data.Title.toLowerCase().replace(/ /g, "-") + "-" + data.year;
                    data.genres = genres;
                    data.is_multiseries = info.kinopoisk_data.is_multiseries || 0;
                    data.poster = info.imdb_data.Poster;
                    data.description = info.kinopoisk_data.description;
                    data.message = "Информация получена!";

                    return res.json({data});
                }));
        })
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.addmovie = function(req, res, next) {
    if (!req.body.url.match(/^[a-zA-Z\d][\w\-]{2,}[a-zA-Z\d]$/)) {
        return res.status(403).json({message: "URL фильма/сериала может состоять только из 4х и более букв, цифр и символов '_'"});
    }

    Movie.createnew(req.body)
        .then((movie) => res.json({message: `Добавлен фильм: <a href="movies/${movie.url}" target="_blank">"${movie.title}"</a>`}))
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.editmovie = function(req, res, next) {
    Movie.findOne({url: req.body.url}, {_id: false})
        .then((movie) => {
            if (!movie) throw new Error("Фильм не найден!");
            return Promise.all([
                Promise.resolve(movie),
                Genre.getTitlesByNumbers(movie.genres)
                    .then((genres) => genres.map((item) => item.title))
            ]);
        })
        .then((movie) => res.json(movie))
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.updatemovie = function(req, res, next) {
    res.locals.title = req.body.title;
    delete req.body.title;
    Movie.upd(req.body)
        .then(() => res.json({message: `Информация о фильме/сериале <a href="movies/${req.body.url}" target="_blank">"${res.locals.title}"</a> обновлена.`}))
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.deletemovie = function(req, res, next) {
    Movie.del(req.body.url)
        .then(() => res.json({message: `Фильм/сериал (${req.body.url}) удалён.`}))
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.blockuser = function(req, res, next) {
    User.findOne({username: req.body.username})
        .then((user) => {
            if (!user) throw new Error("Пользователь не найден.");
            return User.findOneAndUpdate({username: req.body.username}, {blocked: true});
        })
        .then(() => res.json({username: req.body.username}))
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.unblockuser = function(req, res, next) {
    User.findOne({username: req.body.username})
        .then((user) => {
            if (!user) throw new Error("Пользователь не найден.");
            return User.findOneAndUpdate({username: req.body.username}, {blocked: false});
        })
        .then(() => res.json({username: req.body.username}))
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.getuserreviews = function(req, res, next) {
    Review.find({username: req.body.username}, {_id: false}, {sort: {_id: -1}})
        .then((reviews) => res.json({reviews}))
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.removeuserreviews = function(req, res, next) {
    Review.deleteMany({username: req.body.username})
        .then(() => res.json({username: req.body.username}))
        .catch((err) => res.status(403).json({message: err.message}));
};

exports.removeuserreview = function(req, res, next) {
    Review.deleteOne({username: req.body.username, url: req.body.url})
        .then(() => res.json({}))
        .catch((err) => res.status(403).json({message: err.message}));
};
exports.exporttoexcel = function(req, res, next) {
    
    Movie.find({}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var xl = require('excel4node')
            var wb = new xl.Workbook();
            var ws = wb.addWorksheet('Sheet 1');
            var style = wb.createStyle({
              font: {
                color: '#000000',
                size: 12,
              },
              numberFormat: '$#,##0.00; ($#,##0.00); -',
            });
            let i=1;
            for(let key in result[0]){
                ws.cell(1,i).string(key).style(style);
                i++;
            }
            
           
            wb.write('Excel.xlsx');
            var mime = require('mime');
            var file ='Excel.xlsx';
            var filename = 'Excel.xlsx'; 
            var mimetype = mime.lookup(file); 
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);  
            res.setHeader('Content-type', mimetype); 
            var filestream = fs.createReadStream(file); 
            filestream.pipe(res);
        }    
    });
         
};
exports.exporttojson = function(req, res, next) {
    Movie.find({}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            fs.writeFile("ExportToJson.json", JSON.stringify(result), function(error){//запись данных в файл на сервере
 
                if(error) throw error; // если возникла ошибка
                console.log("Асинхронная запись файла завершена. Содержимое файла:");
                let data = fs.readFileSync("ExportToJson.json", "utf8");
                console.log(data);
            });
            var mime = require('mime');
            var file ='ExportToJson.json';
            var filename = 'ExportToJson.json'; 
            var mimetype = mime.lookup(file); 
            res.setHeader('Content-disposition', 'attachment; filename=' + filename);  
            res.setHeader('Content-type', mimetype); 
            var filestream = fs.createReadStream(file); 
            filestream.pipe(res);//поток для скачивания файла клиентом
        }
    });
         
};