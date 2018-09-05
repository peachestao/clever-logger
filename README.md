# clever-logger
a logger for nodejs's connect,express web framework,it can record request and response pivotal data,it also can custom  log,support output to console or local file

npm address: [clever-logger](https://www.npmjs.com/package/clever-logger)

# Installation
npm install clever-logger

# API

var logger=require('clever-logger');
var app=require('express')();
## logger.init(jsonObjectparameter)
this function is necessary,before use this middleware,must first invoke it.this function with a json parameter,it is optional,if no definition,system would use default parameter

var defaultOptions={

    dynamicLog:{ //record request and response log setting

            isConsole:false,//whether show on console, default false
            immediate:false,//whether wait for request finish show or immediate show,default false
            successPath:'',//custom success log path,default logs/currentDate/success.log
            errorPath:'',//custom success log path,default logs/currentDate/error.log
            logFields:['url','method','statusCode','responseTime'] //custom request and response field,default 'url','method','statusCode','responseTime'
        },
    staticLog:{ //custom log setting
    
            isConsole:false//whether show on console,default false
            infoPath:'',//custom logger.Info function log path
            debugPath:'',//custom logger.Debug function log path
            warnPath:'',//custom logger.Warn function log path
            errorPath:''//custom logger.Error function log path
        },
        format:'',//file or dir's name format,optional values:'yyyy-mm-dd' and 'yyyy-mm-dd hh'
        organizationType:1, //log file organization type,optional values:1 and 2 such as 1：logs/2018-08-31/success.log 2：logs/2018-08-31_success.log
}

logger.init(defaultOptions);

you alse not use parameter such as：

logger.init();

## app.use(logger(stringObjectParameter))
this is a middleware use,record requeset and response key data
if you no set parameter,such as app.use(logger()), system will use default value ':url :method :statusCode :reponseTime'
you also use part field such as app.use(logger(':url :statusCode'))


## logger.Info(data,function(err){});
if isConsole field value set true,the word color will be green
## logger.Debug(data,function(err){});
if isConsole field value set true,the word color will be blue
## logger.Warn(data,function(err){});
if isConsole field value set true,the word color will be yellow
## logger.Error(data,function(err){});
if isConsole field value set true,the word color will be red

# Usage
## Record Request and Response Log

var logger=require('clever-logger');
var express=require('express');
var app=express();

logger.init();

app.use(logger(':url :method :statusCode :responseTime'));
app.listen('3000');

## Custom Log
var logger=require('clever-logger');
var express=require('express');
var app=express();


logger.init(
{

    dynamicLog:{
            isConsole:true,
        },
    staticLog:{
            isConsole:true,
            errorPath:'error.log'
        },
        format:'yyyy-mm-dd hh',
        organizationType:2
});

logger.Info('this is a info message',function(err){
    
});

logger.Debug('this is a info message',function(err){
    
});

logger.Warn('this is a info message',function(err){
    
});

logger.Error('this is a info message',function(err){
    
});

# Dependent Packages 
- [on-finished](https://www.npmjs.com/package/on-finished)
- [colors](https://www.npmjs.com/package/colors)
# Node Version
support node version>=0.8
