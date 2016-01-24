// START - YOU WILL NEED TO OVERWRITE THESE VALUES
// Nina WebSocket Server
var host = "nim-rd.nuance.mobi";
var port = 8884;
var path = "nina-websocket-api/nina";

// For the NinaStartSession CONNECT message
var nmaid = "VPowellCo_MySecretary_20160123_181640";
var nmaidKey = "39a494288289d98218e79f2123e992a0134a47973acdd7fbea05ea9487bc5a34a0151b2b51ed29a7d081db115dac59491e82b3202d08d4796a2f15532d877c0a";

// For the NinaStartSession COMMAND message
var appName = "VPowellCo";
var companyName = "MySecretary";
var appVersion = "0.0";
// END - YOU WILL NEED TO OVERWRITE THESE VALUES



// Messages templates
var message_connect = {connect: {nmaid: nmaid, nmaidKey: nmaidKey}};
var message_start = {command: {name: "NinaStartSession", appName: appName, companyName: companyName, appVersion: appVersion}};
var message_end = {command: {name: "NinaEndSession"}};

// Audio handlers
var audioContext = initAudioContext();
var audioPlayer = new AudioPlayer(audioContext); // For the play audio command


// The WebSocket
var socket;



function initWebSocket() {

    socket = new WebSocket("wss://" + host + ":" + port + "/" + path); // The WebSocket must be secure "wss://"
    socket.binaryType = "arraybuffer"; // Important for receiving audio

    socket.onopen = function () {
        console.log("WebSocket connection opened.");

        socket.send(JSON.stringify(message_connect));
        socket.send(JSON.stringify(message_start));
    };

    socket.onclose = function () {
        console.log("WebSocket connection closed.");
    };

    socket.onmessage = function (event) {

        if (isOfType("ArrayBuffer", event.data)) { // The play audio command will return ArrayBuffer data to be played
            audioPlayer.play(event.data);

        } else { // event.data should be text and you can parse it
            var response = JSON.parse(event.data);

            if (response.QueryResult) {

                if (response.QueryResult.result_type === "NinaStartSession") {
                    ui_sessionHasStarted();

                } else if (response.QueryResult.result_type === "NinaEndSession") {
                    ui_sessionHasEnded();

                    socket.close();
                    socket = undefined;

                } else if (response.QueryResult.result_type === "NinaDoNLU") {
                    ui_displayNLUresults(response.QueryResult.nlu_results);
                    
                } else if (response.QueryResult.result_type === "NinaDoSpeechReco") {
                    $('#speechreco_results').text(JSON.stringify(response));
                }
                
            } else if (response.QueryRetry) {
                $('#speechreco_results').text(JSON.stringify(response));
            }
        }
    };
}

function startSession() {
    ui_startSession();

    if (socket === undefined) {
        initWebSocket();
    }
}

function endSession() {
    ui_endSession();

    socket.send(JSON.stringify(message_end));
}

function nlu() {
    var inputText = fixLineBreaks($("#nlu_text").val());

    if (!$("#nlu_button").hasClass("disabled")) {

        ui_clearNLUresults();

        socket.send(JSON.stringify({
            command: {
                name: "NinaDoNLU",
                text: inputText
            }
        }));
    }
}

function playAudio() {
    var inputText = fixLineBreaks($("#playaudio_text").val());

    if (!$("#playaudio_button").hasClass("disabled")) {

        socket.send(JSON.stringify({
            command: {
                name: "NinaPlayAudio",
                text: inputText
            }
        }));
    }
}




var audioRecorder;
var shouldStopRecording = true;


function stopRecording() {
    ui_stopRecording();
    
    shouldStopRecording = true;    
    
    audioRecorder.stop();
    audioRecorder = undefined;
    
    socket.send(JSON.stringify({
        endcommand: {}
    }));
}

function startRecording() {
    ui_startRecording();
    
    socket.send(JSON.stringify({
        command: {
            name: "NinaDoSpeechReco"
        }
    }));
    
    shouldStopRecording = false;  
    console.log("Recorder started.");

    // IMPORTANT Make sure you create a new AudioRecorder before you start recording to avoid any bugs !!!
    audioRecorder = new AudioRecorder(audioContext);
    
    audioRecorder.start().then(
            
            // This callback is called when "def.resolve" is called in the AudioRecorder.
            // def.resolve
            function () {
                console.log("Recorder stopped.");
            },
            
            // def.reject
            function () {
                console.log("Recording failed!!!");
            },
            
            // def.notify
            function (data) { // When the recorder receives audio data
                console.log("Audio data received...");
                
                if (shouldStopRecording) {
                    return;
                }

                // tuple: [encodedSpx, ampArray]
                //   resampled audio as Int16Array 
                //   amplitude data as Uint8Array
                var frames = data[0]; // Int16Array

                socket.send(frames.buffer);
            }
    );
}