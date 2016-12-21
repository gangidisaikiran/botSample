var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', [
	function (session, args, next) {
    	if (!session.userData.name) {
    		session.beginDialog('/profile');
    	}
    	else {
    		next();
    	}
    },
    function (session, results, next) {
    	if(!session.userData.requirement) {
    		session.send('Hi ' + session.userData.name );
    		session.beginDialog('/requirement')
    	}
    	else {
    		next();
    	}
    },
    function (session, results) {
    	if(session.userData.name && session.userData.requirement)
    	{
	    	session.userData.requirement = null;
	    	session.send('Unfortuantely I dont support that now! Can I help you with something else?');
	    	session.beginDialog('/requirement');
    	}
    }
]);

bot.dialog('/profile', [
	function (session) {
		builder.Prompts.text(session, 'What is you name?');
	},
	function (session, results) {
		session.userData.name = results.response;
		session.endDialog();
	}
]);

bot.dialog('/requirement', [
	function (session, results) {
		builder.Prompts.text(session, 'What can I help you with today');
    },
    function (session, results) {
    	session.userData.requirement = results.response;
    	session.endDialog();
    }

]);