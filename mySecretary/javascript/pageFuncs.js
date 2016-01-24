/**
 * Created by Victoria on 2016-01-24.
 */
//
//var theElement = document.getElementById("btnImage");
//
//theElement.addEventListener("mouseup", tapOrClick(), false);
//theElement.addEventListener("touchend", tapOrClick(), false);
//
//function tapOrClick(event) {
//    //handle tap or click.
//    //AudioRecorder();
//
//    var image = document.getElementById('btnImage');
//    if (image.src.match("start")) {
//        image.src = "images/end_1.png";
//    } else {
//        image.src = "images/start_1.png";
//    }
//
//    event.preventDefault();
//    return false;
//}

//function clickBtn(element){
//    alert("We Have liftoff!");
//}

function startRequest(element){
    startSession();
    element.setAttribute('src', 'images/end_1.png');
    element.setAttribute('onclick', 'endRequest(this)');
    setTimeout(function(){startRecording();}, 5000);
    alert("works");
}

function endRequest(element){
    element.setAttribute('src', 'images/start_1.png');
    element.setAttribute('onclick', 'startMessage(this)');
    alert("works to end");
}
