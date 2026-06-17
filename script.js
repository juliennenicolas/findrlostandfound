/* ==========================================================================
   FINDR — shared site behavior
   Works across all pages; every block checks the element exists first.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------- mobile nav toggle ---------- */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
  }

  /* ---------- "System Mockups" dropdown ---------- */
  var dropdown = document.querySelector(".nav-dropdown");
  if (dropdown) {
    var dropdownBtn = dropdown.querySelector(".nav-dropdown-btn");
    dropdownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      dropdown.classList.toggle("open");
    });
    document.addEventListener("click", function (e) {
      if (!dropdown.contains(e.target)) dropdown.classList.remove("open");
    });
  }

  /* ---------- generic tabs (used on dashboard / login role switch) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var buttons = group.querySelectorAll(".tab-btn, .role-tabs button");
    var groupId = group.getAttribute("data-tabs");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var target = btn.getAttribute("data-target");
        document.querySelectorAll('[data-panel-group="' + groupId + '"]').forEach(function (panel) {
          panel.classList.remove("active");
        });
        if (target) {
          var panel = document.querySelector('[data-panel-group="' + groupId + '"][data-panel="' + target + '"]');
          if (panel) panel.classList.add("active");
        }
      });
    });
  });

  /* ---------- contact form (demo submit) ---------- */
  var contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("contact-msg");
      msg.textContent = "Message sent. Our team usually replies within 1–2 business days.";
      msg.classList.remove("error");
      msg.classList.add("show");
      contactForm.reset();
    });
  }

  /* ---------- login form (demo validation) ---------- */
  var loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("login-msg");
      var email = document.getElementById("login-email").value.trim();
      var pass = document.getElementById("login-password").value.trim();
      if (!email || !pass) {
        msg.textContent = "Enter both your email/ID and password to continue.";
        msg.classList.add("error", "show");
        return;
      }
      msg.classList.remove("error");
      msg.textContent = "Login successful. Redirecting to your dashboard \u2026";
      msg.classList.add("show");
      setTimeout(function () { window.location.href = "dashboard.html"; }, 900);
    });
  }

  /* ---------- password show/hide ---------- */
  document.querySelectorAll(".toggle-password").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var input = document.getElementById(btn.getAttribute("data-input"));
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      btn.textContent = input.type === "password" ? "Show" : "Hide";
    });
  });

  /* ---------- registration form (demo validation) ---------- */
  var registerForm = document.getElementById("register-form");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("register-msg");
      var pass = document.getElementById("reg-password").value;
      var confirm = document.getElementById("reg-confirm").value;
      if (pass !== confirm) {
        msg.textContent = "Passwords don't match. Please re-type them.";
        msg.classList.add("error", "show");
        return;
      }
      msg.classList.remove("error");
      msg.textContent = "Account created. You can now log in with your school email.";
      msg.classList.add("show");
      registerForm.reset();
    });
  }

  /* ---------- dashboard bar chart (animate on load) ---------- */
  document.querySelectorAll(".bar-fill").forEach(function (bar) {
    var target = bar.getAttribute("data-height") || "0";
    requestAnimationFrame(function () {
      setTimeout(function () { bar.style.height = target + "%"; }, 80);
    });
  });

  /* ---------- records page: search + status filter ---------- */
  var recordsSearch = document.getElementById("records-search");
  var recordsFilter = document.getElementById("records-filter");
  var recordsRows = document.querySelectorAll("#records-table tbody tr");
  function filterRecords() {
    if (!recordsRows.length) return;
    var q = recordsSearch ? recordsSearch.value.toLowerCase() : "";
    var status = recordsFilter ? recordsFilter.value : "all";
    var visible = 0;
    recordsRows.forEach(function (row) {
      var text = row.textContent.toLowerCase();
      var rowStatus = row.getAttribute("data-status");
      var matchesText = text.indexOf(q) !== -1;
      var matchesStatus = status === "all" || status === rowStatus;
      var show = matchesText && matchesStatus;
      row.style.display = show ? "" : "none";
      if (show) visible++;
    });
    var emptyState = document.getElementById("records-empty");
    if (emptyState) emptyState.style.display = visible === 0 ? "block" : "none";
  }
  if (recordsSearch) recordsSearch.addEventListener("input", filterRecords);
  if (recordsFilter) recordsFilter.addEventListener("change", filterRecords);

  /* ---------- records page: row delete (demo only) ---------- */
  document.querySelectorAll(".delete-row-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var row = btn.closest("tr");
      if (row) row.remove();
    });
  });

  /* ---------- profile page: edit toggle ---------- */
  var editBtn = document.getElementById("profile-edit-btn");
  var profileForm = document.getElementById("profile-form");
  if (editBtn && profileForm) {
    var inputs = profileForm.querySelectorAll("input, textarea, select");
    editBtn.addEventListener("click", function () {
      var editing = editBtn.getAttribute("data-editing") === "true";
      inputs.forEach(function (el) {
        if (el.type !== "submit") el.disabled = editing;
      });
      editBtn.setAttribute("data-editing", editing ? "false" : "true");
      editBtn.textContent = editing ? "Edit profile" : "Cancel editing";
      var saveBtn = document.getElementById("profile-save-btn");
      if (saveBtn) saveBtn.style.display = editing ? "none" : "inline-flex";
    });
  }
  if (profileForm) {
    profileForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = document.getElementById("profile-msg");
      if (msg) msg.classList.add("show");
    });
  }

  /* ---------- reports page: date range demo regenerate ---------- */
  var reportBtn = document.getElementById("generate-report-btn");
  if (reportBtn) {
    reportBtn.addEventListener("click", function () {
      document.querySelectorAll(".bar-fill").forEach(function (bar) {
        var rand = 20 + Math.floor(Math.random() * 75);
        bar.style.height = rand + "%";
        var labelEl = bar.parentElement.querySelector(".bar-value");
        if (labelEl) labelEl.textContent = rand;
      });
    });
  }

});