var apiUrl = "/api/message";

function populateMessageList(res) {
  var elements = res.results.map(function(msg) {
      var e = $('<button></button>');
      e.addClass('list-group-item');
      e.attr('type', 'button');
      e.attr('style', 'overflow:hidden; white-space:nowrap; text-overflow:ellipsis;');
      e.text(msg.message);
      e.click(function() { $.get(msg.url, populateMessageDetails); });
      return e;
  });
  $('#message-count').text(res.count);
  $('#message-list').empty();
  if (elements.length > 0) $('#message-list').append(elements);
  else $('#message-list').append("There are currently no messages.");
}

function populateMessageDetails(res) {
  if ("error" in res) {
      resetSelection();
      $('#message-timestamp').text("This message no longer exists. Please select another.");
      refresh();
      return;
  }
  var palinText = "This message is ";
  if (res.palindrome === false) palinText += "NOT ";
  palinText += "a palindrome";
  $('#message-timestamp').text("Created " + res.date_created);
  $('#message-content').text(res.message);
  $('#message-palindrome').text(palinText);
  $('#message-delete').off();
  $('#message-delete').click(function() { deleteMessage(res.url)});
  $('#message-delete').removeAttr('disabled');
}

function deleteMessage(url) {
  $.ajax({'url': url, 'method': 'DELETE', 'success': function(res) {
      resetSelection();
      refresh();
  }});
}

function resetSelection() {
  $('#message-timestamp').text("Select a message on the left to view details.");
  $('#message-content').text("");
  $('#message-palindrome').text("-");
  $('#message-delete').off();
  $('#message-delete').attr('disabled', 'disabled');
}

function submitMessage() {
  var msg = $("#message-new").val().trim();
  if (msg.length < 1) return;
  var data = {'message': msg};
  $.post(apiUrl, data, function(res) {
      refresh();
  });
}

function refresh() {
  $.get(apiUrl, populateMessageList);
}

$(document).ready(function(){
  refresh();
  resetSelection();
  $("#message-refresh").click(refresh);
  $("#message-submit").click(submitMessage);
});