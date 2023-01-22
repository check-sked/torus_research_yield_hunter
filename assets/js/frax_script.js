document.addEventListener("DOMContentLoaded", function () {
  // Get form fields
  const poolTokens = document.getElementById("pool_tokens");
  //const poolRewards = document.getElementById("pool_rewards");
  const chain = document.getElementById("chain");
  const form = document.getElementById("form");

  // Add event listener to form submit event
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    // Make GET request to Frax API endpoint
    fetch("https://api.frax.finance/pools")
      .then((response) => response.json())
      .then((data) => {
        // Sort data by apy in descending order
        data = data.sort((a, b) => b.apy - a.apy);
        // Apply filters
        if (poolTokens.value) {
          data = data.filter((pool) =>
            pool.pool_tokens.some(
              (token) => token.toLowerCase() === poolTokens.value.toLowerCase()
            )
          );
        }
        //if (poolRewards.value) {
        //data = data.filter((pool) =>
        //pool.pool_rewards
        //.toLowerCase()
        //.includes(poolRewards.value.toLowerCase())
        //);
        //}
        if (chain.value) {
          data = data.filter((pool) =>
            pool.chain.toLowerCase().includes(chain.value.toLowerCase())
          );
        }
        if (!data.length) {
          alert("No results found for this asset + chain combo.");
          return;
        }
        // Create CSV file
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent +=
          "chain,platform,pool_tokens,liquidity_locked,apy,apy_max\n"; //removed pool_rewards; add after pool_tokens to include functionality
        data.forEach((pool) => {
          csvContent += `${pool.chain},${pool.platform},`;
          csvContent += `"${pool.pool_tokens.join(", ")}",`;
          //csvContent += `"${pool.pool_rewards.join(", ")}",`;
          csvContent += `${pool.liquidity_locked},${pool.apy},${pool.apy_max}\n`;
        });
        // Download CSV file
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "frax_pools_search.csv");
        document.body.appendChild(link);
        link.click();
        console.log("Data filtered and downloaded as frax_pools_search.csv.");
      })
      .catch((error) => {
        console.error(error);
      });
  });
});
