
var onResponseWillFinish=require('on-finished');
var fs=require('fs');
var colors=require('colors');
colors.setTheme({
    info:'green',
    warn:'yellow',
    debug:'blue',
    error:'red'
});

var defaultOptions={
    dynamicLog:{
        isConsole:false,
        immediate:false,
        successPath:'',
        errorPath:'',
        logFields:['url','method','statusCode','responseTime']
    },
    staticLog:{
        isConsole:false,
        infoPath:'',
        debugPath:'',
        warnPath:'',
        errorPath:'',
    },
    format:'yyyy-mm-dd',//'yyyy-mm-dd',yyyy-mm-dd hh',
    organizationType:1, //1：logs/2018-08-31/success.log 2：logs/2018-08-31_success.log
}

//格式化日期
function getSpecialTimeFormat(format) {
    var time = new Date();
    debugger;
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var day = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();
    var sec = time.getSeconds();
    var mill = time.getMilliseconds();
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
    mill = mill < 10 ? '0' + mill : mill;
    sec = sec < 10 ? '0' + sec : sec;
    if(format=="yyyy-mm-dd"){
        return year+'-'+month+'-'+day;
    }else if(format=="yyyy-mm-dd hh")
        return year+'-'+month+'-'+day+' '+hour;
    else if(format=="yyyy-mm-dd hh:mm:ss.fff")
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec + '.' + mill;
}

function writeFile(fileType,data,callback){
    var path='';
    var defaultPath='';
    switch(fileType){
        case 'success':
            path=this.dynamicLog.successPath;
            defaultPath='success.log';
            break;
        case 'error-dynamic':
            path=this.dynamicLog.errorPath;
            defaultPath='error.log';
            break;
        case 'info':
            path=this.staticLog.infoPath;
            defaultPath='info.log';
            break;
        case 'debug':
            path=this.staticLog.debugPath;
            defaultPath='debug.log';
            break;
        case 'warn':
            path=this.staticLog.warnPath;
            defaultPath='warn.log';
            break;
        case 'error':
            path=this.staticLog.errorPath;
            defaultPath='error.log';
            break;
        default:
            break;
    }

    if (!fs.existsSync('logs')) {
        fs.mkdirSync('logs');
    }
    if(path=='') //系统默认路径
    {
        var dir = 'logs/' + getSpecialTimeFormat(this.format);
        if (this.organizationType == 1) //以日期创建文件夹
        {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
            path = dir + '/' + defaultPath;
        }
        else {
            path = dir + '_' + defaultPath;
        }
    }

    var wsStream=fs.createWriteStream(path,{flags:'a',encoding:'utf-8',
        autoClose:true});
    wsStream.on('open',function(){
        wsStream.write('['+getSpecialTimeFormat("yyyy-mm-dd hh:mm:ss.fff")+']'+' '+data+'\r\n');
        wsStream.end();
    });
    wsStream.on('error',function(err){
        callback(err);
    })
}
function getDynamicLogContent(fields){
    debugger;
    var content='';
    for(var index in fields)
        content+=this[fields[index]]?this[fields[index]]+' ':'';
    return content;
}
function logger(options){

    if(!logger.options) {
        return function(req,res,next){
            next();
        }
    }
    if(arguments.length>0)
    {
        logger.options.dynamicLog.logFields =[]
        var tokens = options.split(' ');
        debugger;
        for(var index in tokens){
            logger.options.dynamicLog.logFields.push(tokens[index].substr(1));
        }
    }

    return function(req,res,next) {
        req.startTime = new Date().getTime();
        var dynamicLog=logger.options.dynamicLog;
        var reqData = getDynamicLogContent.call(req, dynamicLog.logFields);
        if (dynamicLog.immediate)
        {
            writeLog.call(logger.options,'success',reqData,function(err){
                next(new Error(err));
            });
        }
        else {
            req.tempData=reqData;
        }

        onResponseWillFinish(res, function (err) {
            debugger;
            res.startTime = new Date().getTime();
            res.responseTime=(res.startTime - req.startTime).toString();
            var resData=getDynamicLogContent.call(res, dynamicLog.logFields);
            if (!dynamicLog.immediate) {
                resData=req.tempData+resData;
            }

            writeLog.call(logger.options,'success',resData,function(err){
                next(new Error(err));
            });

        })
        next();
    }
}
function checkJson(text){
    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        return true;
    }else{
        return false;
    }
}

logger.init=function(options) {
    if(arguments.length==0) {
        logger.options = defaultOptions;
        return;
    }
    logger.options=defaultOptions;
    for(var key1 in options){
        debugger;
        if(key1=='dynamicLog'||key1=='staticLog'){
            for(var key2 in options[key1])
            {
                logger.options[key1][key2]=options[key1][key2];
            }
        }
        else
        {
            logger.options[key1]=options[key1];
        }
    }
}

function writeLog(fileType,data,cb){
    if (this.staticLog.isConsole) {
        switch(fileType){
            case 'info':
                console.log(data.info);
                break;
            case 'debug':
                console.log(data.debug);
                break;
            case 'warn':
                console.log(data.warn);
                break;
            case 'success':
                console.log(data.info);
                break;
            case 'error':
                console.log(data.error);
                break;
            case 'error-dynamic':
                console.log(data.error);
                break;
        }

    }
    else {
        writeFile.call(this,fileType,data,function(err){
            cb(err);
        })
    }
}

logger.Info=function(data,cb) {
    writeLog.call(logger.options,'info',data,cb);

}

logger.Debug=function(data,cb) {
    writeLog.call(logger.options,'debug',data,cb);

}

logger.Warn=function(data,cb) {
    writeLog.call(logger.options,'warn',data,cb);
}

logger.Error=function(data,cb) {
    writeLog.call(logger.options,'error',data,cb);
}

module.exports=logger;
