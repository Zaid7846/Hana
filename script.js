const scriptURL = "https://script.google.com/macros/s/AKfycbx0yg-PFcWnOSCf7tWNcgSl6XX0CCqR6gDh0eg87aGioHkUD5TKs8IaGpqW5Qy991Ma/exec";
    let flavourOptions = [];
    let sizeOptions = [];

    // Fetch flavour and size data from Google Sheet
    fetch(scriptURL)
      .then(res => res.json())
      .then(data => {
        flavourOptions = data.flavours;
        sizeOptions = data.sizes;
        addOrderRow(); // start with one row
      })
      .catch(err => console.error('Error loading data:', err));

    function addOrderRow() {
      const container = document.getElementById("orderList");
      const row = document.createElement("div");
      row.classList.add("order-row");

      const flavourSelect = document.createElement("select");
      flavourOptions.forEach(f => {
        const opt = document.createElement("option");
        opt.value = f; opt.textContent = f;
        flavourSelect.appendChild(opt);
      });

      const sizeSelect = document.createElement("select");
      sizeOptions.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s; opt.textContent = s;
        sizeSelect.appendChild(opt);
      });

      const qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.placeholder = "Qty";
      qtyInput.min = 1;
      qtyInput.required = true;

      const unitSelect = document.createElement("select");
      ["Bottle", "Crate"].forEach(u => {
        const opt = document.createElement("option");
        opt.value = u;
        opt.textContent = u;
        unitSelect.appendChild(opt);
      });

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "❌";
      deleteBtn.className = "delete-btn";
      deleteBtn.onclick = () => container.removeChild(row);

      row.appendChild(flavourSelect);
      row.appendChild(sizeSelect);
      row.appendChild(qtyInput);
      row.appendChild(unitSelect);
      row.appendChild(deleteBtn);

      container.appendChild(row);
    }

    document.getElementById("orderForm").addEventListener("submit", e => {
      e.preventDefault();

      const orders = [];
      document.querySelectorAll(".order-row").forEach(row => {
        const [flavour, size, qty, unit] = row.querySelectorAll("select, input");
        orders.push({
          flavour: flavour.value,
          size: size.value,
          quantity: qty.value,
          unit: unit.value
        });
      });

      const payload = {
        orderBy: document.getElementById("orderBy").value,
        shopName: document.getElementById("shopName").value,
        address: document.getElementById("address").value,
        mobile: document.getElementById("mobile").value,
        orders
      };

      fetch(scriptURL, {
        method: "POST",
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(() => {
    alert("Order submitted successfully!");

    let customerNumber = document.getElementById("mobile").value.replace(/\D/g,''); // remove non-digits
    let orderBy = document.getElementById("orderBy").value;
    let shopName = document.getElementById("shopName").value;
    let address = document.getElementById("address").value;

    let message = `*Hana Cold Drinks* — Order Confirmation\n`;
    message += `Order By: ${orderBy}\n`;
    message += `Shop: ${shopName}\n`;
    message += `Address: ${address}\n`;
    message += `Mobile: ${customerNumber}\n\n`;

    document.querySelectorAll(".order-row").forEach((row, i) => {
        const [flavour, size, qty, unit] = row.querySelectorAll("select, input");
        message += `${i+1}. ${flavour.value} — ${size.value} — ${qty.value} ${unit.value}\n`;
    });

    message += `\nThank you for your order!`;

    let encodedMessage = encodeURIComponent(message);

    // Check if number seems valid for WhatsApp (simple check: length 10–13 digits)
    if(customerNumber.length >= 10 && customerNumber.length <= 13) {
        // Redirect to WhatsApp
        window.location.href = `https://wa.me/91${customerNumber}?text=${encodedMessage}`;
    } else {
        alert("Order saved! Customer number may not be valid for WhatsApp, so no message was sent.");
    }

    // Reset form & order list
    document.getElementById("orderForm").reset();
    document.getElementById("orderList").innerHTML = "";
    addOrderRow();
})
      /*.then(() => {
        alert("Order submitted successfully!");
        document.getElementById("orderForm").reset();
        document.getElementById("orderList").innerHTML = "";
        addOrderRow();
      })*/
      .catch(err => {
        console.error("Error submitting:", err);
        alert("Error submitting order");
      });
    });
