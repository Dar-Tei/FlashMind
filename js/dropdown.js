// dropdown.js - Custom dropdown component

export class CustomDropdown {
  constructor(selectElement) {
    this.selectElement = selectElement;
    this.customDropdown = null;
    this.isOpen = false;
    this.selectedIndex = selectElement.selectedIndex;

    this.init();
  }

  init() {
    // Hide original select
    this.selectElement.style.display = "none";

    // Create custom dropdown
    this.createCustomDropdown();

    // Insert after original select
    this.selectElement.parentNode.insertBefore(
      this.customDropdown,
      this.selectElement.nextSibling
    );

    // Attach events
    this.attachEvents();
  }

  createCustomDropdown() {
    const wrapper = document.createElement("div");
    wrapper.className = "custom-dropdown";

    // Create selected display
    const selected = document.createElement("div");
    selected.className = "custom-dropdown-selected";

    const selectedText = document.createElement("span");
    selectedText.className = "custom-dropdown-text";
    selectedText.textContent =
      this.selectElement.options[this.selectedIndex].text;

    const arrow = document.createElement("span");
    arrow.className = "custom-dropdown-arrow";
    arrow.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';

    selected.appendChild(selectedText);
    selected.appendChild(arrow);

    // Create options list
    const optionsList = document.createElement("div");
    optionsList.className = "custom-dropdown-options";

    Array.from(this.selectElement.options).forEach((option, index) => {
      const optionElement = document.createElement("div");
      optionElement.className = "custom-dropdown-option";
      optionElement.textContent = option.text;
      optionElement.dataset.value = option.value;
      optionElement.dataset.index = index;

      if (index === this.selectedIndex) {
        optionElement.classList.add("selected");
      }

      if (option.disabled) {
        optionElement.classList.add("disabled");
      }

      optionsList.appendChild(optionElement);
    });

    wrapper.appendChild(selected);
    wrapper.appendChild(optionsList);

    this.customDropdown = wrapper;
    this.selectedDisplay = selected;
    this.selectedText = selectedText;
    this.optionsList = optionsList;
    this.arrow = arrow;
  }

  attachEvents() {
    // Toggle dropdown
    this.selectedDisplay.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Select option
    this.optionsList.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("custom-dropdown-option") &&
        !e.target.classList.contains("disabled")
      ) {
        const index = parseInt(e.target.dataset.index);
        this.selectOption(index);
      }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!this.customDropdown.contains(e.target)) {
        this.close();
      }
    });

    // Keyboard navigation
    this.customDropdown.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.close();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.toggle();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.isOpen) {
          this.selectNext();
        } else {
          this.open();
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.isOpen) {
          this.selectPrevious();
        } else {
          this.open();
        }
      }
    });

    // Make focusable
    this.customDropdown.setAttribute("tabindex", "0");
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.customDropdown.classList.add("open");
    this.optionsList.style.display = "block";

    // Scroll to selected option
    const selectedOption = this.optionsList.querySelector(".selected");
    if (selectedOption) {
      selectedOption.scrollIntoView({ block: "nearest" });
    }
  }

  close() {
    this.isOpen = false;
    this.customDropdown.classList.remove("open");
    this.optionsList.style.display = "none";
  }

  selectOption(index) {
    if (index < 0 || index >= this.selectElement.options.length) return;

    this.selectedIndex = index;

    // Update original select
    this.selectElement.selectedIndex = index;

    // Trigger change event
    const event = new Event("change", { bubbles: true });
    this.selectElement.dispatchEvent(event);

    // Update display
    this.selectedText.textContent = this.selectElement.options[index].text;

    // Update selected class
    this.optionsList
      .querySelectorAll(".custom-dropdown-option")
      .forEach((opt, i) => {
        opt.classList.toggle("selected", i === index);
      });

    this.close();
  }

  selectNext() {
    let nextIndex = this.selectedIndex + 1;
    while (nextIndex < this.selectElement.options.length) {
      if (!this.selectElement.options[nextIndex].disabled) {
        this.selectOption(nextIndex);
        break;
      }
      nextIndex++;
    }
  }

  selectPrevious() {
    let prevIndex = this.selectedIndex - 1;
    while (prevIndex >= 0) {
      if (!this.selectElement.options[prevIndex].disabled) {
        this.selectOption(prevIndex);
        break;
      }
      prevIndex--;
    }
  }

  destroy() {
    if (this.customDropdown) {
      this.customDropdown.remove();
    }
    this.selectElement.style.display = "";
  }
}

// Auto-initialize all selects with class 'custom-select'
export function initCustomDropdowns(container = document) {
    // Remove old dropdowns in the container
    container.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        dropdown.remove();
    });
    
    // Initialize all selects in the container
    const selects = container.querySelectorAll('select.input');
    const dropdowns = [];
    
    selects.forEach(select => {
        // Remove initialized flag if it exists
        select.removeAttribute('data-dropdown-initialized');
        // Create new dropdown
        dropdowns.push(new CustomDropdown(select));
    });
    
    return dropdowns;
}