$(document).ready(function () {
    $('.secondaryTab').hide();
});

function ui_startSession() {
    $('#label-start-end').text('Communicating with the server...');
}

function ui_endSession() {
    $('#label-start-end').text('Communicating with the server...');
}

function ui_sessionHasStarted() {
    $('#button-start-end')
            .toggleClass('btn-primary btn-danger')
            .text("End session")
            .attr('onclick', 'endSession()')
            .blur();
    $('#label-start-end').text('You currently have an active session.');

    $('.secondaryTab').fadeIn();
}

function ui_sessionHasEnded() {
    $('#button-start-end')
            .toggleClass('btn-primary btn-danger')
            .text("Start session")
            .attr('onclick', 'startSession()')
            .blur();
    $('#label-start-end').text('You currently have no active session.');

    $('.secondaryTab').fadeOut();
}

function ui_clearNLUresults() {
    $('#nlu_results').text("");
}

function ui_displayNLUresults(results) {
    $('#nlu_results').text(JSON.stringify(results));
}

function ui_startRecording() {
    $('#speechreco_results').text("");
    
    $('#speechreco_button')
            .toggleClass('btn-primary btn-danger')
            .text("Stop recording")
            .attr('onclick', 'stopRecording()')
            .blur();
}

function ui_stopRecording() {
    $('#speechreco_button')
            .toggleClass('btn-primary btn-danger')
            .text("Start recording")
            .attr('onclick', 'startRecording()')
            .blur();
}