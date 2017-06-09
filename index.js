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
        commandName + ' *[cummies here]*';
    return text;
}

function getFullHelp(commandName) {
    var text =
        'Lets you send anonymous messages to specific channels.\n' +
        'The most convenient and safe way is to open up a conversation with Slackbot and type the commands there, so that nobody detects that you are typing and you don\'t accidentally reveal yourself by typing an invalid command.\n' +
        'Messages and authors are not stored; source for UNC Slack is available at <https://github.com/Randomqwerty/uncslack>.\n' +
        '\n' +
        getUsageHelp(commandName);

    return text;
}

function createResponsePayload(requestBody) {
    if (!requestBody) {
        return createError('Request is empty');
    }

    var text = requestBody.text;
    var command = requestBody.command;

    if (!text || text === 'help') {
        return createError(getFullHelp(command));
    }

    var remainingText = 'Someone said "' + text + '"';

    return {
        text: remainingText
    };
}

app.post('/', function(req, response) {
    var payloadOption = createResponsePayload(req.body);
	var messages = ["Message delivered! :pepepls:", "Cummies delivered! :sweat_drops:", "Coochies successfully gooched! :gucci:", "Dick pics sent to Carol! :carol-folt-thumbs-up:", "Zelda's AI revised! :sweat_smile:", "Privilege Czeched! :flag-cz:", "Another dick slain! You have gained 5 experience points. :eggplant:", "#WeDemandUNC: More bread for Weast :^)", "Where do we stand on the ((Sargon Question))? :pepegun:", ":b:iscuits successfully tickled!", "I wumbo. You wumbo. He- she-me wumbo. Wumbo; Wumboing; We'll have the wumbo; Wumborama; Wumbology; the study of Wumbo. It's first grade, Spongebob! :wumbo:", "Goop successfully shlurped! :tongue:"],
    message = messages[Math.floor(Math.random() * messages.length)];
    if (payloadOption.error) {
        response.end(payloadOption.error);
        return;
    }
    request({
        url: process.env.POSTBACK_URL,
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
