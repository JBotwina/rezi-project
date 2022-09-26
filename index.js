import pets from "./dogs.json" assert { type: "json" };
import { getRandomNumber, debounce } from "./utils.js";
const template = document.createElement("template");
template.innerHTML = `
  <style>
  .pet-card {
		font-family: 'Arial', sans-serif;
        margin: auto;
		background: #f4f4f4;
		width: 500px;
		display: grid;
		grid-template-columns: 1fr 2fr;
		grid-gap: 10px;
		margin-bottom: 15px;
		border-bottom: purple 5px solid;
        border-radius: 25px;
	}

	.pet-card img {
		width: 100%;
        border-radius: 25px;
	}
    .info {
    }

	.pet-card button {
		cursor: pointer;
		background: purple;
		color: #fff;
		border: 0;
		border-radius: 5px;
		padding: 5px 10px;
	}
  </style>
  <div id="pet" class="pet-card">
    <img />
    <div>
      <h3></h3>
      <div class="info">
        <p><slot name="gender" /></p>
        <p><slot name="type" /></p>
        <p><slot name="description" /></p>
        <p><slot name="fee" /></p>
      </div>
      <button id="toggle-info">Show Info</button>
    </div>
  </div>
`;

class PetCard extends HTMLElement {
  constructor() {
    super();

    this.showInfo = false;

    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    const info = this.shadowRoot.querySelector(".info");
    info.style.display = "none";
  }

  toggleInfo() {
    this.showInfo = !this.showInfo;

    const info = this.shadowRoot.querySelector(".info");
    const toggleBtn = this.shadowRoot.querySelector("#toggle-info");

    if (this.showInfo) {
      info.style.display = "block";
      toggleBtn.innerText = "Hide Info";
    } else {
      info.style.display = "none";
      toggleBtn.innerText = "Show Info";
    }
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("#pet")
      .addEventListener("click", () => this.toggleInfo());
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("#pet").removeEventListener();
  }
}

window.customElements.define("pet-card", PetCard);

class Fetcher {
  constructor() {
    this.pets = pets;
    this.count = 0;
  }

  initialize() {
    this.addToPage();
  }

  addToPage() {
    let start = this.count * 20;
    let end = (this.count + 1) * 20;
    if (end > this.pets.length) {
      alert("No more pets");
      return;
    }
    let loadedPets = this.pets.slice(start, end);
    for (const pet of loadedPets) {
      const el = document.createElement("pet-card");
      el.shadowRoot.querySelector("h3").innerText = `${pet.name}, ${pet.age}`;
      el.shadowRoot.querySelector("img").src = pet.url + getRandomNumber();

      this.addSlot(el, "type", pet.type);
      this.addSlot(el, "gender", pet.gender);
      this.addSlot(el, "description", pet.description);
      this.addSlot(el, "fee", pet.fee);
      document.body.append(el);
    }
    this.count++;
  }

  addSlot(node, attribute, value) {
    let att = document.createElement("div");
    att.setAttribute("slot", attribute);
    att.innerText = value;
    node.appendChild(att);
  }
}

let fetcher = new Fetcher();
fetcher.initialize();

function checkAtBottom() {
  if (
    document.documentElement.scrollTop + window.innerHeight >=
    document.documentElement.scrollHeight
  ) {
    console.log("Adding to page");
    fetcher.addToPage();
  }
}

const debounceScrollCheck = debounce(() => checkAtBottom());

document.addEventListener("wheel", (_event) => debounceScrollCheck());
document.addEventListener("scroll", (_event) => debounceScrollCheck());
