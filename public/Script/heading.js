const headerTemplate = document.createElement("template");

headerTemplate.innerHTML = `
  <style>
    @import url("/Style/Header.css");
  </style>

  <header>
    <div class="blog-header">
      <a href="/index.html" class="logo-link">
        <img class="logo-img" src="/images/Logo.png" alt="Logo" />
      </a>

      <div class="dropdown">
        <button class="dropbtn"></button>
        <div class="dropdown-content">
          <a class="download" href="/Pages/Downloads.html">Flight Scrapers</a>
          <a class="next" href="/Pages/FuckU.html">Fuck You Dudee</a>
          <a class="converter" href="/Pages/Link2Down.html">Convert Download Link</a>
          <a class="converter" href="/Pages/UnitConverter.html">Convert Units</a>
          <a class="next" href="/Projects/RPSS/Play.html">Rock Paper Scissor</a>
          <a class="next" href="/Projects/FlexBox/flex1.html">Flex zone</a>
          <a class="next" href="/Projects/Etch/Color/aids.html">Sketch zone</a>
          <a class="next" href="/Projects/localStorage/gay.html">Storage zone </a>
          <a class="next" href="/Projects/vendingMachine/vender.html">Vending Machine</a>

          </div>
      </div>
    </div>
  </header>
`;

class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "closed" });

    shadowRoot.appendChild(headerTemplate.content.cloneNode(true));

    // Get input from hello.html
    const input = localStorage.getItem("input");

    // Use the input as needed
    console.log("Input from hello.html:", input);
  }
}

customElements.define("header-component", Header);
