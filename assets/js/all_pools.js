function createCSV() {
  var url = "https://yields.llama.fi/pools";

  // Make API request using fetch
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Sorting the data by APY in descending order
      data = data.data.sort((a, b) => b.apy - a.apy);

      // Creating a CSV file
      var csv = "chain,project,symbol,apy,tvlUsd,pool\n";
      data.forEach((pool) => {
        csv += `${pool.chain},${pool.project},${pool.symbol},${pool.apy},${pool.tvlUsd},${pool.pool}\n`;
      });

      // Creating a link to download the CSV file
      var hiddenElement = document.createElement("a");
      hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
      hiddenElement.target = "_blank";
      hiddenElement.download = "all_pools_by_apy.csv";
      hiddenElement.click();
    })
    .catch((err) => {
      alert("Error Occurred: " + err);
    });
}
