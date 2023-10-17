document.addEventListener("DOMContentLoaded", function () {
  // WebSocket connection for questions
  var questionSocket = createWebSocket("ws://127.0.0.1:8181/question");
  questionSocket.onmessage = function (event) {
    displayQuestion(event.data);
  };

  // WebSocket connection for answers
  var answerSocket = createWebSocket("ws://127.0.0.1:8181/answer");
  answerSocket.onmessage = function (event) {
    displayAnswerStatus(event.data);
  };

  var answerInput = document.getElementById("answer-input");
  var submitButton = document.getElementById("submit-answer");
  var answerStatus = document.getElementById("answer-status");
  var name = document.getElementById("name");

  submitButton.addEventListener("click", function () {
    var userAnswer = answerInput.value;
    var userName = name.innerText;
    answerSocket.send(
      JSON.stringify({
        name: userName,
        answer: userAnswer,
      })
    );
  });

  function createWebSocket(url) {
    var socket = new WebSocket(url);
    socket.onopen = function () {
      console.log("WebSocket connection established");
    };
    socket.onerror = function (error) {
      console.error("WebSocket error: ", error);
    };
    return socket;
  }

  function displayQuestion(question) {
    document.getElementById("question-text").innerText = question;
  }

  function displayAnswerStatus(status) {
    answerStatus.innerText = status;
  }
});
