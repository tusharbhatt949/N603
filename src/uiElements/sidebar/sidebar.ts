import { ASSETS } from "../../constants/assets";
import { FeatureCategory } from "../../constants/enums";
import { subFeatureTabsData } from "../../constants/subFeatureTabsData";
import { SVG } from "../../constants/svgs";
import { setCameraToDeafultPosition } from "../../utils/cameraRotation";
import { hideHeaderBrandLogo, redirectToHome, resetSceneState, selectTab, showHeaderBrandLogo, updateHeaderBrandLogoVisibility } from "../../utils/utils";
import { createColorsBox } from "../colorsBox/colorsBox";

export function createUI(): HTMLElement {
  const container = document.createElement("div");
  container.id = "sidebar-container";

  container.innerHTML = `
  <div id= "sidebarAndCollapseContainer">
  <div id ="sidebarAndColorBoxContainer">

  <div id="sidebar">
      <div id="sidebar-logo">
        <img src="${ASSETS.LOGO.tvsKingEvMaxLogo}" alt="tvskingevmaxlogo">
      </div>
      ${Object.values(FeatureCategory)
      .map((category) => {
        const subfeatures = subFeatureTabsData[category] || [];
        console.log("category", category)
        return `
            <div class="sidebar-item" data-category="${category}">
              <div class="category-icon">
              <img src="${ASSETS.SIDEBAR[normalizeKey(category) as keyof typeof ASSETS.SIDEBAR] || ""}" alt="${category}" />

              </div>
              <p class="category-label">${category}</p>
              <span class="carrot">
                ${SVG.SIDEBAR.carrot}
              </span>
            </div>
            <div class="subcategory-list" data-category="${category}">
              ${subfeatures
            .map(
              (sub) => `
                    <div class="subcategory-item" data-subcategory="${sub.title}" data-category="${category}">
                      ${sub.title}
                    </div>
                    <div class="subcategory-content" data-content="${sub.title}">
                      ${sub.content}
                    </div>
                  `
            )
            .join("")}
            </div>
          `;
      })
      .join("")}
    </div>
    <div id = "colorBoxContainer">
        
    </div>
      
  </div>
    <div id="sidebarToggleBtn">
  <img src="${ASSETS.SIDEBAR.collapseIcon}"/>
</div>
<!-- <div id="sidebarToggleBtn-expandIcon" class="hidden">
  <img src="${ASSETS.SIDEBAR.expandIcon}"/>
</div> -->
    </div>
    <div id="sidebarToggleBtn-expandIcon" class="hidden">
        <img src="${ASSETS.SIDEBAR.expandIcon}"/>
      </div>
  `;

  attachEventListeners(container);
  return container;
}

export function normalizeKey(str: string): string {
  return str.replace(/\s+/g, "").toLowerCase();
}


function attachEventListeners(container: HTMLElement) {

  eventListenerCollapseSidebar(container)

  const sidebarLogo = container.querySelector("#sidebar-logo") as HTMLElement;
  sidebarLogo?.addEventListener("click", () => redirectToHome());

  const headerRow2 = container.querySelector("#colorBoxContainer") as HTMLElement;
  if (headerRow2) {
    headerRow2.appendChild(createColorsBox());
  }

  const categoryItems = container.querySelectorAll(".sidebar-item");

  categoryItems.forEach(item => {
    item.addEventListener("click", () => {
      const category = item.getAttribute("data-category");
      if (!category) return;


      // Toggle category activation
      const isActive = item.classList.contains("activeCategory");

      container.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("activeCategory"));
      container.querySelectorAll(".subcategory-list").forEach(list => list.classList.remove("activeSubcategory-list"));

      if (!isActive) {
        item.classList.add("activeCategory");
        const subcategoryList = container.querySelector(`.subcategory-list[data-category="${category}"]`);
        if (subcategoryList) {
          subcategoryList.classList.add("activeSubcategory-list");
        }
        scrollToCategory(category as FeatureCategory)
      } else {
        resetSceneState()
        setCameraToDeafultPosition()
        deselectSubcategoryItem()
      }

    });
  });

  // Subcategory logic
  const subcategoryItems = container.querySelectorAll(".subcategory-item");

  subcategoryItems.forEach(subItem => {
    subItem.addEventListener("click", () => {
      const subcategory = subItem.getAttribute("data-subcategory");
      const category = subItem.getAttribute("data-category");
      if (!category) return;

      // Get all subcategories under this category
      const subcategories = Array.from(container.querySelectorAll(`.subcategory-item[data-category="${category}"]`));
      const index = subcategories.indexOf(subItem); // Dynamically determine index

      // Remove active class from all subcategories and contents
      container.querySelectorAll(".subcategory-item").forEach(el => el.classList.remove("activeSubCategoryItem"));
      container.querySelectorAll(".subcategory-content").forEach(content => content.classList.remove("activeSubCategoryContent"));

      // Activate the clicked subcategory
      subItem.classList.add("activeSubCategoryItem");
      const content = container.querySelector(`.subcategory-content[data-content="${subcategory}"]`);
      if (content) {
        content.classList.add("activeSubCategoryContent");
      }

      // Call selectTab with the correct index
      selectTab(category as FeatureCategory, index);
    });
  });
}

function eventListenerCollapseSidebar(container: HTMLElement) {
  const collapseBtn = container.querySelector("#sidebarToggleBtn") as HTMLElement;
  const expandBtn = container.querySelector("#sidebarToggleBtn-expandIcon") as HTMLElement;

  // Initial hide for safety (in case something breaks CSS)
  expandBtn.classList.add("hidden");

  collapseBtn?.addEventListener("click", () => {
    container.classList.add("collapsed");

    // After animation ends, show expand button and hide collapse
    setTimeout(() => {
      collapseBtn.classList.add("hidden");
      expandBtn.classList.remove("hidden");
      showHeaderBrandLogo()
    }, 380); // Match CSS transition duration

  });

  expandBtn?.addEventListener("click", () => {
    container.classList.remove("collapsed");

    expandBtn.classList.add("hidden");
    collapseBtn.classList.remove("hidden");
    hideHeaderBrandLogo()

  });
}


export function deselectSubcategoryItem() {
  const container = document.getElementById("sidebar-container");
  container?.querySelectorAll(".subcategory-item").forEach(el => el.classList.remove("activeSubCategoryItem"));
  container?.querySelectorAll(".subcategory-content").forEach(content => content.classList.remove("activeSubCategoryContent"));
}

export function deselectMainCategory() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  // Remove active class from all categories and subcategory lists
  container.querySelectorAll(".sidebar-item").forEach(el => el.classList.remove("activeCategory"));
  container.querySelectorAll(".subcategory-list").forEach(list => list.classList.remove("activeSubcategory-list"));
}

export function scrollToCategory(category: FeatureCategory) {
  console.log("scrolling to cat")
  const categoryElement = document.querySelector(
    `.sidebar-item[data-category="${category}"]`
  ) as HTMLElement;

  if (categoryElement && category != FeatureCategory.HeavyDuty) {
    categoryElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  if (category == FeatureCategory.HeavyDuty) {
    categoryElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

export function scrollToSubcategoryItemByIndex(category: FeatureCategory, index: number) {
  console.log("scrolling to subcategory item by index");

  const subcategoryItems = document.querySelectorAll(
    `.subcategory-item[data-category="${category}"]`
  );

  const targetItem = subcategoryItems[index] as HTMLElement;
  if (!targetItem) return;

  const isLastOrSecondLastItem =
    index === subcategoryItems.length - 1 || index === subcategoryItems.length - 2;

  if (category === FeatureCategory.HeavyDuty || category == FeatureCategory.Convenience) {
    if (isLastOrSecondLastItem) {
      const sidebar = document.getElementById("sidebar");
      if (sidebar) {
        // Scroll sidebar to the bottom
        sidebar.scrollTo({
          top: sidebar.scrollHeight,
          behavior: "smooth",
        });
      } else {
        // Fallback: scroll the item into view at the bottom
        targetItem.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    } else {
      // For other subcategory items in Technology
      targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  } else {
    // For all other categories
    targetItem.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}


