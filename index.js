var config = require("config");
var execSync = require("child_process").execSync;
var _ = require("underscore");
var request = require("request");

if (process.argv.length < 4) {
	//TODO Print Usage.
    return;
}

/**
 * Post message to Chatwork room.
 */
var postChatwork = function (roomId, apiKey, message, callback) {
	var endpointBase = "https://api.chatwork.com/v1/";
    var options = {
        url: endpointBase + "rooms/" + roomId + "/messages",
        headers: {
             "X-ChatWorkToken": apiKey
        },
        form: {
			body: message
        },
        json: true
    };

    request.post(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            callback(false, body);
        } else {
            callback(true, "error:" + response.statusCode);
        }
    });
};

/**
 * Retrieve revision info from Subversion and build commit message string.
 */
var createCommitMessage = function (repoName, repoPath, revision, withFiles) {
    var message = "New Commit To Repositoy: " + repoName + "\n";

    var result = "" + execSync("svnlook author " + repoPath + " -r " + rev);
    message += "Author: " + result;

    result = "" + execSync("svnlook log " + repoPath + " -r " + rev);
    message += result;

    if (withFiles) {
		result = "" + execSync("svnlook changed " + repoPath + " -r " + rev);
		message += "Files Changed: \n";
		message += result;
    }
    
	return message;
};

/**
 * Post commited revision info to Chatwork.
 */
var postCommitToChatwork = function (repoPath, rev, callback) {
	var apiKeys = config.get("api_keys");
	var repos = config.get("repos");

	if (!_.has(repos, repoPath)) {
		callback(true, "Setting for repository missing: " + repoPath);
		return;
	}
	
	var repoInfo = repos[repoPath];
	if (!_.has(apiKeys, repoInfo.api_key)) {
		callback(true, "API key setting for repository missing: " + repoPath);
		return;
	}
	
	if (repoInfo.enabled) {
		var message = createCommitMessage(repoInfo.name, repoPath, rev, false);
		postChatwork(repoInfo.room_id, apiKeys[repoInfo.api_key], message, callback);
	}
};

var repoPath = process.argv[2];
var rev = process.argv[3];

postCommitToChatwork(repoPath, rev, function (error, message) {
	if (!error) {
//		console.log("success");
	} else {
//		console.log(message);
	}
});
