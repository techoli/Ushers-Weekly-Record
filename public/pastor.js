document.addEventListener("DOMContentLoaded", () => {
  const API =
    location.hostname === "localhost" || location.hostname === "127.0.0.1"
      ? "http://localhost:3000/api/records"
      : "/api/records";
  const table = document.getElementById("recordsTable");
  const loader = document.getElementById("loader");

  const dates = [];
  const totals = [];
  const offerings = [];

  loader.classList.remove("hidden");

  fetch(API)
    .then((res) => res.json())
    .then((records) => {
      records.reverse().forEach((r) => {
        table.innerHTML += `
            <tr>
              <td>${formatDateTime(r.date)}</td>
              <td>${new Date(r.sunday_date).toLocaleDateString()}</td>
              <td>${r.service_type || ""}</td>
              <td>${r.service_number || ""}</td>
              <td>${formatMoneyValue(r.l_offering) || ""}</td>
              <td>${formatMoneyValue(r.t_offering) || ""}</td>
              <td>${truncate(r.oc_offering) || ""}</td>
              <td>${formatMoneyValue(r.total_offering) || ""}</td>
              <td>${formatMoneyValue(r.min_tithe) || ""}</td>
              <td>${formatMoneyValue(r.cong_tithe) || ""}</td>
              <td>${truncate(r.oc_tithe) || ""}</td>
              <td>${formatMoneyValue(r.total_tithe) || ""}</td>
              <td>${formatMoneyValue(r.total_money) || ""}</td>
              <td>${r.men || ""}</td>
              <td>${r.women || ""}</td>
              <td>${r.children || ""}</td>
              <td>${r.total || ""}</td>
              <td>${r.new_convert || ""}</td>
              <td>${r.first_timers || ""}</td>
            </tr>
          `;

        dates.push(new Date(r.sunday_date).toLocaleDateString());
        totals.push(r.total);
        offerings.push(r.total_money);
      });

      drawAttendanceChart(dates, totals);
      drawOfferingChart(dates, offerings);
      loader.classList.add("hidden");
    });
});

function drawAttendanceChart(labels, data) {
  new Chart(document.getElementById("attendanceChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Attendance",
          data,
          borderWidth: 3,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true },
      },
    },
  });
}

function formatMoneyValue(num) {
  return Number(num || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function drawOfferingChart(labels, data) {
  new Chart(document.getElementById("offeringChart"), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Total Money",
          data,
          borderWidth: 3,
          tension: 0.3,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            callback: (value) => "TSh" + value.toLocaleString(),
          },
        },
      },
    },
  });
}

function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("landscape", "pt");

  doc.setFontSize(14);
  doc.text("Christ The Redeemer Ministries – Weekly Record", 40, 40);

  const headers = [
    [
      "Record Time",
      "Sunday Date",
      "Service Type",
      "Service No",
      "Love Offering",
      "Thanks Offering",
      "OC Offering",
      "Total Offering (TZS)",
      "Minister Tithe",
      "Cong Tithe",
      "OC Tithe",
      "Total Tithe (TZS)",
      "Total Money (TZS)",
      "Men",
      "Women",
      "Children",
      "Total Attendance",
      "New Converts",
      "First Timers",
    ],
  ];

  const body = [];

  document.querySelectorAll("#recordsTable tr").forEach((tr) => {
    const row = Array.from(tr.children).map((td) => td.innerText.trim());
    body.push(row);
  });

  if (body.length === 0) {
    alert("No data to export");
    return;
  }

  doc.autoTable({
    startY: 70,
    head: headers,
    body: body,
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 4,
      halign: "center",
      valign: "middle",
    },
    headStyles: {
      fillColor: [44, 62, 80],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
    tableWidth: "auto",
  });

  doc.save("weekly-record.pdf");
}

function exportExcel() {
  const headers = [
    "Record Time",
    "Sunday Date",
    "Service Type",
    "Service Number",
    "Love Offering",
    "Thanks Offering",
    "OC Offering",
    "Total Offering (TZS)",
    "Minister Tithe",
    "Cong Tithe",
    "OC Tithe",
    "Total Tithe (TZS)",
    "Total Money (TZS)",
    "Men",
    "Women",
    "Children",
    "Total Attendance",
    "New Converts",
    "First Timers",
  ];

  const data = [headers];

  document.querySelectorAll("#recordsTable tr").forEach((tr) => {
    const row = Array.from(tr.children).map((td) => td.innerText.trim());
    data.push(row);
  });

  if (data.length === 1) {
    alert("No data to export");
    return;
  }

  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(wb, ws, "Weekly Records");
  XLSX.writeFile(wb, "weekly-records.xlsx");
}

function formatDateTime(isoString) {
  const d = new Date(isoString);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    d.getFullYear() +
    "-" +
    pad(d.getMonth() + 1) +
    "-" +
    pad(d.getDate()) +
    " " +
    pad(d.getHours()) +
    ":" +
    pad(d.getMinutes()) +
    ":" +
    pad(d.getSeconds())
  );
}

// Usage
// formatDateTime("2025-12-30T09:28:45.246Z");
function truncate(text, max = 10) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

// → "2025-12-30 09:28:45"
