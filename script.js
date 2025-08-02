// Retrieve data from localStorage or initialize empty array
let transformerData = JSON.parse(localStorage.getItem("transformerData")) || [];

// Handle form submission
const form = document.getElementById("dataForm");
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const entry = {
    date: document.getElementById("date").value,
    shift: document.getElementById("shift").value,
    transformer: document.getElementById("transformer").value,
    oti: parseFloat(document.getElementById("oti").value),
    wti: parseFloat(document.getElementById("wti").value),
    tap: document.getElementById("tap").value,
    oilLevel: document.getElementById("oilLevel").value
  };

  transformerData.push(entry);
  localStorage.setItem("transformerData", JSON.stringify(transformerData));

  form.reset();
  alert("✅ Data saved successfully!");
});

// View data based on selected date and shift
function viewData() {
  const date = document.getElementById("viewDate").value;
  const shift = document.getElementById("viewShift").value;
  const output = document.getElementById("output");

  const filtered = transformerData.filter(
    d => d.date === date && d.shift === shift
  );

  output.innerHTML = "";

  if (filtered.length === 0) {
    output.innerHTML = "<li>No data found for selected date and shift.</li>";
    return;
  }

  filtered.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "bg-gray-100 p-4 rounded shadow";

    li.innerHTML = `
      <strong>${item.transformer}</strong> - OTI: ${item.oti}°C, WTI: ${item.wti}°C<br/>
      Tap: ${item.tap}, Oil Level: ${item.oilLevel}
      <button onclick="deleteEntry(${index})" class="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm float-right">Delete</button>
    `;

    output.appendChild(li);
  });
}

// Delete entry
function deleteEntry(index) {
  transformerData.splice(index, 1);
  localStorage.setItem("transformerData", JSON.stringify(transformerData));
  viewData(); // refresh view
}

// Show/hide tabs
function showTab(id) {
  document.getElementById("logTab").style.display = "none";
  document.getElementById("viewTab").style.display = "none";
  document.getElementById("trendTab").style.display = "none";

  document.getElementById(id).style.display = "block";
}

// Plot monthly trend using Chart.js
function plotTrend() {
  const month = document.getElementById("trendMonth").value;
  const transformer = document.getElementById("trendTransformer").value;

  const filtered = transformerData.filter(d =>
    d.date.startsWith(month) && d.transformer === transformer
  );

  if (filtered.length === 0) {
    alert("No data for selected month and transformer.");
    return;
  }

  const labels = filtered.map(d => d.date + " (" + d.shift + ")");
  const otiData = filtered.map(d => d.oti);
  const wtiData = filtered.map(d => d.wti);

  const ctx = document.getElementById("trendChart").getContext("2d");
  if (window.trendChart) window.trendChart.destroy(); // clear previous

  window.trendChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "OTI (°C)",
          data: otiData,
          borderColor: "#ff6b6b",
          backgroundColor: "rgba(255,107,107,0.2)",
          fill: true,
          tension: 0.3
        },
        {
          label: "WTI (°C)",
          data: wtiData,
          borderColor: "#1d4ed8",
          backgroundColor: "rgba(29,78,216,0.2)",
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          title: { display: true, text: "Temperature (°C)" }
        },
        x: {
          title: { display: true, text: "Date" }
        }
      }
    }
  });
}
