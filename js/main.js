/* Base Layer: email-based contact form and ordering " mailto method " */
(function () {
  "use strict";
  var CONTACT_EMAIL = "baselayerorders@gmail.com";
  var ORDERS_EMAIL = "baselayerorders@gmail.com";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function mailto(to, subject, body) {
    return (
      "mailto:" +
      to +
      "?subject=" +
      encodeURIComponent(subject) +
      "&body=" +
      encodeURIComponent(body)
    );
  }

  // Validate a list of [inputId, label, optionalEmailCheck]. Returns true when all are valid.
  function validate(fields) {
    var firstBad = null;
    fields.forEach(function (f) {
      var el = document.getElementById(f[0]);
      var err = document.getElementById(f[0] + "-err");
      var v = el.value.trim();
      var msg = "";
      if (!v) {
        msg = "Error: please enter your " + f[1] + ".";
      } else if (f[2] && !EMAIL_RE.test(v)) {
        msg = "Error: enter a valid email address, like name@example.com.";
      }
      err.textContent = msg;
      if (msg) {
        el.setAttribute("aria-invalid", "true");
        if (!firstBad) firstBad = el;
      } else {
        el.removeAttribute("aria-invalid");
      }
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  var contact = document.getElementById("contact-form");
  if (contact) {
    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("form-status");
      var ok = validate([
        ["c-name", "name"],
        ["c-email", "email address", true],
        ["c-subject", "subject"],
        ["c-message", "message"],
      ]);
      if (!ok) {
        status.textContent =
          "Your message was not prepared. Please fix the errors above.";
        return;
      }
      var body =
        "Name: " +
        document.getElementById("c-name").value.trim() +
        "\nEmail: " +
        document.getElementById("c-email").value.trim() +
        "\nSubject: " +
        document.getElementById("c-subject").value.trim() +
        "\n\nMessage:\n" +
        document.getElementById("c-message").value.trim();
      var link = mailto(
        CONTACT_EMAIL,
        document.getElementById("c-subject").value.trim(),
        body,
      );
      status.innerHTML =
        'Your email app should open with your message ready. Review it and press send there. Nothing has been sent yet. If nothing opens, <a href="' +
        link +
        '">use this link</a> or email ' +
        CONTACT_EMAIL +
        ".";
      window.location.href = link;
    });
  }

  var order = document.getElementById("order-form");
  if (order) {
    var img = document.getElementById("product-img");
    var qty = document.getElementById("qty");
    var product = order.dataset.product,
      slug = order.dataset.slug,
      price = Number(order.dataset.price);
    var chosen = function (name) {
      return order.querySelector('input[name="' + name + '"]:checked');
    };
    var setQty = function (n) {
      qty.value = Math.min(20, Math.max(1, Math.round(n) || 1));
    };
    var peso = function (n) {
      return "PHP " + n.toFixed(2);
    };

    order.querySelectorAll('input[name="color"]').forEach(function (r) {
      r.addEventListener("change", function () {
        img.src = "images/" + slug + "-" + r.dataset.key + ".png";
        img.alt = product + ", " + r.value.toLowerCase() + ", front view";
        document.getElementById("color-name").textContent = r.value;
      });
    });
    document.getElementById("qty-minus").addEventListener("click", function () {
      setQty(Number(qty.value) - 1);
    });
    document.getElementById("qty-plus").addEventListener("click", function () {
      setQty(Number(qty.value) + 1);
    });
    qty.addEventListener("change", function () {
      setQty(Number(qty.value));
    });

    order.addEventListener("submit", function (e) {
      e.preventDefault();
      var status = document.getElementById("order-status");
      setQty(Number(qty.value));
      if (
        !validate([
          ["o-name", "name"],
          ["o-address", "delivery address"],
          ["o-phone", "contact number"],
        ])
      ) {
        status.textContent =
          "Your order email was not prepared. Please fix the errors above.";
        return;
      }
      var q = Number(qty.value);
      var body =
        "Hello Base Layer,\n\nI would like to order:\n\n" +
        "Product: " +
        product +
        "\nColor: " +
        chosen("color").value +
        "\nSize: " +
        chosen("size").value +
        "\nQuantity: " +
        q +
        "\nPrice per item: " +
        peso(price) +
        "\nTotal price: " +
        peso(price * q) +
        "\n\nCustomer name: " +
        document.getElementById("o-name").value.trim() +
        "\nDelivery address: " +
        document.getElementById("o-address").value.trim() +
        "\nContact number: " +
        document.getElementById("o-phone").value.trim() +
        "\n\nThank you!";
      var link = mailto(ORDERS_EMAIL, "Order: " + product, body);
      status.innerHTML =
        'Your email app should open with your order ready. Review it and press send there. Your order is not placed until you send it and we reply to confirm. If nothing opens, <a href="' +
        link +
        '">use this link</a> or email ' +
        ORDERS_EMAIL +
        ".";
      window.location.href = link;
    });
  }
})();
