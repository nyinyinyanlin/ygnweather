const express = require('express');
const exphbs = require('express-handlebars');
const rqpr = require('request-promise');
const path = require('path');
const app = express();
const port = 3000;
const options = {
        method: 'GET',
        uri: 'http://api.openweathermap.org/data/2.5/weather',
        qs: {
                id: '1298822',
                APPID: '26fa04626cc3882388b191681f67c6bf',
                units: 'metric'
                }
        };
var ygnweather = null;
var weatherObj = {
	/*200:,201:,202:,
	210:,211:,212:,
	221:,
	230:,231:,232:,
	300:,301:,302:,
	310:,311:,312:,313:,314:,321:,*/
	500:"မိုးဖွဲကျ",501:"မိုးအနည်းငယ်ရွာ",502:"မိုးသည်းထန်စွာရွာ",503:"မိုးအလွန်သည်းထန်စွာရွာ",504:"မိုးပြင်းထန်စွာရွာ",/*
	511:,
	520:,521:,522:,
	531:,
	600:,601:,602:,
	611:,612:,615:,616:,
	620:,621:,622:,
	701:,
	711:,
	721:,
	731:,
	741:,
	751:,
	761:,762:,
	771:,
	791:,*/
	800:"တိမ်ကင်းစင်",801:"တိမ်အနည်းငယ်ဖုံး",/*802:,803:,804:,
	900:,901:,902:,903:,904:,905:,906:,*/
	951:"ရာသီဥတုတည်ငြိမ်"/*,952:,953:,954:,956:,957:,958:,959:,
	960:,961:,962:,*/
};

function getWeather(weatherCode){
	return weatherObj[weatherCode];
}

function getNum(enNumChar){
	var numArray = ['၀','၁','၂','၃','၄','၅','၆','၇','၈','၉'];
	if(enNumChar==46){
		return '.';
	}else{
		return numArray[enNumChar-48];
	}
}

function enNumMm(number){
	numString = number.toString();
	mmNumString = "";
	for(i=0;i<numString.length;i++){
		mmNumString += getNum(numString.charCodeAt(i));
	}
	return mmNumString;
}

function getWeatherCondition(){
	rqpr(options)
		.then(function (response) {
			console.log("Request successful")
			console.log(response)
			ygnweather = JSON.parse(response)
		})
		.catch(function (err) {
			console.log("Something bad happened",err)
			ygnweather = null
		})
	setTimeout(getWeatherCondition, 300000);
	}

getWeatherCondition();

app.engine('handlebars',exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use('/public',express.static('public'));
app.get('/weather',function(req,res){
	if (ygnweather) {
		weather = ygnweather.weather[0];
		data = ygnweather.main;
		if (weather.icon.charAt(weather.icon.length-1)=='d') {
			bgcolor = "white";
			fontcolor = "black";
		} else {
			bgcolor = "black";
			fontcolor = "white";
		}
		res.render('home',{
			icon: weather.id+"-"+weather.icon.charAt(weather.icon.length-1),
			weather: "ရန်ကုန်မြို့တွင်" + getWeather(weather.id),
			credit: "Yangon Binary House ၏လက်ရာ",
			bgcolor: bgcolor,
			fontcolor: fontcolor,
			temp: enNumMm(data.temp),
			press: enNumMm(data.pressure),
			humidity: enNumMm(data.humidity),
			wind: enNumMm(ygnweather.wind.speed)
			});
		}
	else {
		console.log("error")
		res.render('error',{
			error: "We are sorry",
			credit: "Yangon Binary House is sorry for inconvenience"
			})
		}
	});

app.listen(port,function(err){
		if (err) {
			return console.log("Error listening on port: 3000",err);
		}
		console.log("Server listening on port: 3000");
	});