const API =
  location.hostname === "localhost" || location.hostname === "127.0.0.1"
    ? "http://localhost:3000/api/records"
    : "/api/records";

const loader = document.getElementById("loader");

/* ===============================
   HELPERS
================================ */
function parseMoney(val) {
  if (!val) return 0;
  return Number(val.replace(/,/g, ""));
}

function formatMoneyValue(num) {
  return Number(num || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function attachMoneyFormatter(input) {
  if (!input) return;
  input.addEventListener("blur", () => {
    const value = parseMoney(input.value);
    input.value = value ? formatMoneyValue(value) : "";
  });
}

/* ===============================
   DATE CHECKS
================================ */
function isLastSunday(date) {
  const d = new Date(date);
  if (d.getDay() !== 0) return false;

  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  const lastSunday = new Date(lastDay);
  lastSunday.setDate(lastDay.getDate() - lastDay.getDay());

  return d.toDateString() === lastSunday.toDateString();
}

function isWednesday(date) {
  return new Date(date).getDay() === 3;
}

/* ===============================
   INIT
================================ */
document.addEventListener("DOMContentLoaded", () => {
  const service_type = document.getElementById("service_type");
  const service_number = document.getElementById("service_number");
  const sundayPicker = document.getElementById("sundayPicker");

  const l_offering = document.getElementById("l_offering");
  const t_offering = document.getElementById("t_offering");
  const p_offering = document.getElementById("p_offering");
  const total_offering = document.getElementById("total_offering");

  const cong_tithe = document.getElementById("cong_tithe");
  const min_tithe = document.getElementById("min_tithe");
  const total_tithe = document.getElementById("total_tithe");

  const total_money = document.getElementById("total_money");
  const total = document.getElementById("total");
  const men = document.getElementById("men");
  const women = document.getElementById("women");
  const children = document.getElementById("children");

  /* Hide initially */
  t_offering.style.display = "none";
  p_offering.style.display = "none";

  /* Service type logic */
  service_type.addEventListener("change", () => {
    t_offering.style.display =
      service_type.value === "Thanks giving Service" ? "block" : "none";
  });

  /* Date logic */
  sundayPicker.addEventListener("change", () => {
    p_offering.style.display = isLastSunday(sundayPicker.value)
      ? "block"
      : "none";

    if (isWednesday(sundayPicker.value)) {
      cong_tithe.style.display =
        min_tithe.style.display =
        total_tithe.style.display =
        service_number.style.display =
          "none";
      service_type.value = "Mid-week";
    } else {
      cong_tithe.style.display =
        min_tithe.style.display =
        total_tithe.style.display =
        service_number.style.display =
          "block";
      service_type.value = "";
    }
  });

  /* Attach currency formatters */
  [
    l_offering,
    t_offering,
    p_offering,
    cong_tithe,
    min_tithe,
    total_tithe,
    total_offering,
    total_money,
  ].forEach(attachMoneyFormatter);

  /* ===============================
     AUTO TOTALS
  ================================ */

  function calcOffering() {
    const total =
      parseMoney(l_offering.value) +
      parseMoney(t_offering.value) +
      parseMoney(p_offering.value);
    total_offering.value = formatMoneyValue(total);
    calcGrandTotal();
  }

  //   [men, women, children].forEach((el) => {
  //     el.addEventListener("blur", () => {
  //       const totals =
  //         document.getElementById("men").value ||
  //         0 + document.getElementById("women").value ||
  //         0 + document.getElementById("children").value ||
  //         0;
  //       console.log("total: " + total);
  //       total.value = totals;
  //     });
  //   });

  //   const men = document.getElementById("men");
  // const women = document.getElementById("women");
  // const children = document.getElementById("children");
  // const total = document.getElementById("total");

  [men, women, children].forEach((el) => {
    el.addEventListener("input", () => {
      const m = Number(men.value) || 0;
      const w = Number(women.value) || 0;
      const c = Number(children.value) || 0;

      total.value = m + w + c;
      console.log("total:", total.value);
    });
  });

  function showSuccess() {
    success.classList.remove("hidden");
  }

  function calcTithe() {
    const total = parseMoney(cong_tithe.value) + parseMoney(min_tithe.value);
    total_tithe.value = formatMoneyValue(total);
    calcGrandTotal();
  }

  function calcGrandTotal() {
    const total =
      parseMoney(total_tithe.value) + parseMoney(total_offering.value);
    total_money.value = formatMoneyValue(total);
  }

  [l_offering, t_offering, p_offering].forEach((el) =>
    el.addEventListener("input", calcOffering)
  );

  [cong_tithe, min_tithe].forEach((el) =>
    el.addEventListener("input", calcTithe)
  );

  /* ===============================
     FORM SUBMIT
  ================================ */
  const form = document.getElementById("recordForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    loader.classList.remove("hidden");

    const data = {
      sunday_date: sundayPicker.value,
      service_type: service_type.value,
      service_number: service_number.value,

      l_offering: parseMoney(l_offering.value),
      t_offering: parseMoney(t_offering.value),
      p_offering: parseMoney(p_offering.value),
      total_offering: parseMoney(total_offering.value),

      cong_tithe: parseMoney(cong_tithe.value),
      min_tithe: parseMoney(min_tithe.value),
      total_tithe: parseMoney(total_tithe.value),

      total_money: parseMoney(total_money.value),

      men: Number(men.value || 0),
      women: Number(women.value || 0),
      children: Number(children.value || 0),
      total: Number(total.value || 0),

      new_convert: new_convert.value,
      first_timers: first_timers.value,
    };

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (result.success) {
        showSuccess();
        form.reset();
      }
    } catch (err) {
      console.error(err);
    } finally {
      loader.classList.add("hidden");
    }
  });
});
