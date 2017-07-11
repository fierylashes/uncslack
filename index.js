var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

function createError(errorMessage) {
    return {
        error: errorMessage
    };
}

function getUsageHelp(commandName) {
    var text = 'Expected usage: \n' +
        commandName + ' *help* -- Displays help message.\n' +
        commandName + ' *[post your cummies here]*';
    return text;
}

function getFullHelp(commandName) {
    var text =
        'Lets you send anonymous messages to specific channels.\n' +
        'The safest way type the commands in a chat with Slackbot, so that nobody detects that you are typing.\n' +
        'Messages and authors are not stored; source for UNC Slack is available at <https://github.com/Randomqwerty/uncslack>.\n' +
        '\n' +
        getUsageHelp(commandName);

    return text;
}

function createResponsePayload(requestBody) {
    if (!requestBody) {
        return createError('Request is empty');
    }

    var txt = requestBody.text;
    var commandName = requestBody.command;
	var target = commandName.slice(5);
	var colors = ["Red ", "Orange ", "Yellow ", "Green ", "Blue ", "Purple ", "Pink ", "Grey ", "Black "];
	var icons = ["Anchor ", "Flashlight ", "Shovel ", "Socks ", "Boot ", "Acorn ", " Paw ", "Mushroom ", "Oars ", "Tent "];

	if (!txt || txt === 'help') {
        return createError(getFullHelp(commandName));
    }
	
    var remainingText = colors[Math.floor(Math.random() * colors.length)] + icons[Math.floor(Math.random() * icons.length)] + 'said "' + txt + '"';

    return {
        text: remainingText
    };
}

function getChannel(requestBody) {
   var commandName = requestBody.command;
   var target = commandName.slice(5);
   var channel = "a";
	if (target == 'general') {
		channel = process.env.GENERAL;
		} 
	else if (target === 'random') {
		channel = process.env.RAND;
		} 
	else if (target === 'cuck') {
		channel = process.env.CUCK;
		} 
	else if (target === 'nsfw') {
		channel = process.env.NSFW;
		} 
	else if (target === 'advice') {
		channel = process.env.ADVICE;
		} 
	else {
		channel = process.env.ANIMU;
		}
	return channel;
}

app.post('/', function(req, response) {
    var payloadOption = createResponsePayload(req.body);
	var messages = ["Message delivered! :pepe:", "Cummies delivered! :sweat_drops:", "Dick pics sent to Carol! :carol-folt-thumbs-up:", "[UPDATE]: Improved ZeldaBot's response time! :sweat_smile:", "NPC [Dick] was slain! You have gained 5 experience points. :eggplant:"];
	var postchannel = getChannel(req.body);
	
    message = messages[Math.floor(Math.random() * messages.length)];
    if (payloadOption.error) {
        response.end(payloadOption.error);
        return;
    }
    request({
        url: postchannel,
		parse: 'full'
        json: payloadOption,
        method: 'POST'
    }, function (error) {
        if(error) {
            response.end('Unable to post your message: ' + JSON.stringify(error));
        } else {
            response.end(message);
        }

    });
});

app.get('/', function(request, response) {
    response.write('HELLO THERE');
    response.end();
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
