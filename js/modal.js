// modal.js content
$(document).ready(function() {
  $('#searchModal').modal('show');

  $("#modalSearchButton").on("click", function (event) {
      event.preventDefault();
      var country = $("#modalCountryInput").val().trim();
      handleSearch(country);
      $('#searchModal').modal('hide');
  });
});
