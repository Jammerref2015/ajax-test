const baseURL = "https://ci-swapi.herokuapp.com/api/";

function getData(type, cb) {
  var xhr = new XMLHttpRequest(); /*  inbuilt object that JavaScript provides to allow us to consume APIs. */

  /* Open connection */
  xhr.open("GET", baseURL + type + "/"); /* 

GET = retrive data from server */
  xhr.send();

  xhr.onreadystatechange = function () {
    /*whenever the state changes of our xhr object, we want to run a check. */
    if (this.readyState == 4 && this.status == 200) {
      cb(JSON.parse(this.responseText));
      /* this will be sending through a JSON parsed object into our setData function.*/
    }
  };
}

function getTableHeaders(obj) {
  var tableHeaders = [];

  Object.keys(obj).forEach(function (key) {
    tableHeaders.push(`<td>${key}</td>`);
  });

  return `<tr>${tableHeaders}</tr>`;
}

function generatePaginationButtons(next, prev) {
  if (next && prev) {
    return `<button onclick="writeToDocument('${prev})'">Previous</button>``<button onclick="writeToDocument('${next})'">Previous</button>`;
  } else if (next && !prev) {
    return `<button onclick="writeToDocument('${next})'">Next</button>`;
  } else if (!next && prev)
    return `<button onclick="writeToDocument('${prev})'">Previous</button>`;
}

function writeToDocument(type) {
  var tableRows = [];
  var el = document.getElementById("data");
  el.innerHTML = "";

  getData(type, function (data) {
    var pagination;
    if (data.next || data.previous) {
      pagination = generatePaginationButtons(data.next, data.previous);
    }

    data = data.results;
    var tableHeaders = getTableHeaders(data[0]);

    data.forEach(function (item) {
      var dataRow = [];

      Object.keys(item).forEach(function (key) {
        var rowData = item[key].toString();
        var truncateData = rowData.substring(0, 15);
        dataRow.push(`<td>${truncateData}</td>`);
      });
      tableRows.push(`<tr>${dataRow}</tr>`);
    });
    el.innerHTML = `<table>${tableHeaders}${tableRows}</table>${pagination}`.replace(
      /,/g,
      ""
    );
  });
}
