function runScriptAndDownloadCSV() {
  // Get the value of the asset input field
  var symbol_characters = document.getElementById("asset").value;

  // Use JavaScript's fetch API to get the data from the API endpoint
  fetch(`https://yields.llama.fi/pools`)
    .then((response) => response.json())
    .then((data) => {
      data = data.data;
      data = data.filter((item) =>
        item.symbol.toLowerCase().includes(symbol_characters.toLowerCase())
      );
      data = data.sort((a, b) => b.apy - a.apy);
      if (!data.length) {
        alert("No results found for this asset.");
        return;
      }
      // Convert the data to a CSV string
      var csvContent = "data:text/csv;charset=utf-8,";
      var headers = "Chain,Project,Symbol,APY,TVL_USD,Pool_ID";
      var rows = data.map(function (item) {
        return `${item.chain},${item.project},${item.symbol},${item.apy},${item.tvlUsd},${item.pool}`;
      });
      csvContent += headers + "\r\n" + rows.join("\r\n");
      // Create a download link for the CSV file
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "pools_search_by_asset.csv");
      document.body.appendChild(link);
      link.click();
    })
    .catch((error) => console.error(error));
}
