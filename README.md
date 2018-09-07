# clever-logger
a logger for nodejs's connect,express web framework,it can record request and response pivotal data,it also can custom  log,support output to console or local file

# Installation
npm install clever-logger

# API

var logger=require('clever-logger');
var app=require('express')();
## logger.init(jsonObjectparameter)
this function is necessary,before use this middleware,must first invoke it.this function with a json parameter,it is optional,if no definition,system would use default parameter

var defaultOptions={

    level:'',//default:'all' ,optional values:'all','debug','info','warn','error','off'
    //please take attention:dynamicLog normal log think it's log level is debug 
    //all:record all log
    //debug:record debug、info、warn、error log
    //info:record info、warn、error log
    //warn:record warn、error log
    //error:record  error log
    //off:not record any log
    dynamicLog:{ //record request and response log setting

            isConsole:false,//whether show on console, default false
            immediate:false,//whether wait for request finish show or immediate show,default false
            successPath:'',//custom success log path,default logs/currentDate/success.log
            errorPath:'',//custom success log path,default logs/currentDate/error-dynamic.log
            logFields:['url','method','statusCode','responseTime'] //custom request and response field,
            //default 'url','method','statusCode','responseTime'
        },
    staticLog:{ //custom log setting
    
            isConsole:false//whether show on console,default false
            infoPath:'',//custom logger.Info function log path
            debugPath:'',//custom logger.Debug function log path
            warnPath:'',//custom logger.Warn function log path
            errorPath:''//custom logger.Error function log path
        },
        format:'',//file or dir's name format,optional values:'yyyy-mm-dd' and 'yyyy-mm-dd hh'
        organizationType:1, //log file organization type,
        //optional values:1 and 2 such as 1：logs/2018-08-31/success.log 2：logs/2018-08-31_success.log
}

logger.init(defaultOptions);

you alse not use parameter such as：

logger.init();

## app.use(logger(stringObjectParameter))
this is a middleware use,record requeset and response key data
if you no set parameter,such as app.use(logger()), system will use default value ':url :method :statusCode :reponseTime'
you also use part field such as app.use(logger(':url :statusCode'))


## logger.info(data,function(err){});
if isConsole field value set true,the word color will be green
## logger.debug(data,function(err){});
if isConsole field value set true,the word color will be blue
## logger.warn(data,function(err){});
if isConsole field value set true,the word color will be yellow
## logger.error(data,function(err){});
if isConsole field value set true,the word color will be red

# Usage
## Record Request and Response Log
```
var logger=require('clever-logger');
var express=require('express');
var app=express();

logger.init();

app.use(logger(':url :method :statusCode :responseTime'));
app.listen('3000');
```
## Custom Log
```
var logger=require('clever-logger');
var express=require('express');
var app=express();


logger.init(
{

    level:'error',//only record error log,you can set other level,such as:'all','debug','info','warn','off'
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
```
# Dependent Packages 
- [on-finished](https://www.npmjs.com/package/on-finished)
- [colors](https://www.npmjs.com/package/colors)
# Node Version
support node version>=0.8
