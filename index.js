const Telegraf = require('telegraf');
const bot = new Telegraf('1038901632:AAHIpqpYQRqKVXXmFoiB30iXIbGKVzW-PiM');
const session = require('telegraf/session');

const helpMessage = `
/start - start the bot
/help - command reference
/starttimer [work minutes] [break minutes] [long break minutes] [number of work session to make a long break after] - 
start the timer for 'work minutes' with 'break minutes' break and 'long break minutes'
long break after each 'number of work session to make a long break after' work sessions
default settings: 25 min for work session, 5 min for break, 20 min for long break, each 4th work session
/stoptimer - stop the timer
`;
var time = 25;
var restTime = 5;
var longBreakTime = 20;
var breakSession = 7;
var runTime = 0;
var i = 0;
var start = 0;
var timerId = 0;

function intervalHandler(ctx, time, restTime) {
    if (i % 2 == 0) {
        runTime = time;
    }
    else {
        if (i % breakSession == 0) runTime = longBreakTime;
        else runTime = restTime;
    }
    let timeRest = start + runTime - Date.now();
    let minutes = Math.floor(timeRest / 60000);
    let seconds = ((timeRest % 60000) / 1000).toFixed(0);
    if (seconds == 60) {
        minutes += 1;
        seconds = 0;
    }
    if (timeRest <= 0) {
        ctx.telegram.editMessageText(ctx.session.editMessageChatId, ctx.session.editMessageId, ctx.session.editInlineMessageId, '00:00');
        if ((i+1) % breakSession == 0) ctx.reply("It's time for a long break");
        else {
            if (i % 2 == 0) ctx.reply("It's time to rest");
            else ctx.reply("It's time to do the task");
        }
        ctx.session.canEdit = false;
        i += 1;
        start += runTime;
    }
    else {
        let reply = (minutes < 10 ? '0' : '') + minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
        if (ctx.session.canEdit) {
            ctx.telegram.editMessageText(ctx.session.editMessageChatId, ctx.session.editMessageId, ctx.session.editInlineMessageId, reply);
        }
        else {
            ctx.reply(reply).then((replyCtx) => {
                ctx.session.editMessageId = replyCtx.message_id;
                ctx.session.editInlineMessageId = replyCtx.inline_message_id;
                ctx.session.editMessageChatId = replyCtx.chat.id;
                ctx.session.canEdit = true;
            })
        }
    }
}


bot.use(session());

bot.start((ctx) => {
    ctx.reply('You started the pomodoro bot');
    ctx.reply(helpMessage);
})

bot.help((ctx) => {
    ctx. reply(helpMessage);
})

bot.command('starttimer', (ctx) => { 
    let input = ctx.message.text;
    let inputArray = input.split(' ');
    
    if (inputArray.length > 1) time = parseInt(inputArray[1]);
    if (inputArray.length > 2) restTime = parseInt(inputArray[2]);
    if (inputArray.length > 3) longBreakTime = parseInt(inputArray[3]);
    if (inputArray.length > 4) breakSession = parseInt(inputArray[4]) * 2 - 1;
    ctx.reply('You started the timer for ' + time + ' minutes followed by a ' + restTime + ' minutes break');
    time *= 60 * 1000; //number of milliseconds
    restTime *= 60 * 1000;
    longBreakTime *= 60 * 1000;
    start = Date.now();

    timerId = setInterval(intervalHandler, 1000, ctx, time, restTime);   
    
})

bot.command('stoptimer', (ctx) => {
    clearInterval(timerId);
    ctx.session.canEdit = false;
    ctx.reply('You stopped the timer');
    i = 0;
})

bot.launch();