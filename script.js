const query = document.getElementById("search-bar");
const addlinks = document.getElementById("links");
const add = document.getElementById("add-links");
const addname = document.getElementById("add-name");
const addurl = document.getElementById("add-url");
const addIconUrl = document.getElementById("icon-url");
const addDiv = document.getElementById("add-div");
const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.top = e.pageY + "px";
  cursor.style.left = e.pageX + "px";
});

document.addEventListener("mouseleave", () => {
  cursor.style.visibility = "hidden";
});

document.addEventListener("mouseenter", () => {
  cursor.style.visibility = "visible";
});

addlinks.addEventListener("wheel", (event) => {
  event.preventDefault();

  const scrollAmount = event.deltaY * 2;
  addlinks.scrollLeft += scrollAmount;
});

query.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    let url = `https://www.google.com/search?q=${query.value}`;
    window.open(url, "_self");
    query.value = "";
  }
});

add.addEventListener("click", (e) => {
  if (addDiv.style.display === "flex") {
    addDiv.style.display = "none";
  } else {
    addDiv.style.display = "flex";
  }
});

addDiv.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    addDiv.style.display = "none";
    const linkData = {
      name: addname.value,
      url: addurl.value,
      iconUrl: addIconUrl.value || "",
    };
    let links = JSON.parse(localStorage.getItem("elementString")) || [];
    if (!Array.isArray(links)) {
      links = Array.from(links); //recheck
    }
    links.push(linkData);

    localStorage.setItem("elementString", JSON.stringify(links));
    addname.value = "";
    addurl.value = "";
    addIconUrl.value = "";

    loaddata();
  }
});

const createLinkElement = (item) => {
  const linkUrl = item.url;
  const faviconUrl = `${linkUrl}/favicon.ico`;
  const iconUrl = item.iconUrl;

  const element = document.createElement("a");
  element.setAttribute("href", linkUrl);

  const img = new Image();
  if (iconUrl) img.src = iconUrl;
  else img.src = faviconUrl;
  img.alt = 'icon';
  element.innerHTML = '';
  element.appendChild(img);
  element.innerHTML += item.name;

  return element;
}

const linkRemoveMenu = (event, item, index, linkData) => {
  const rightClickMenu = document.querySelector(".right-click-menu");
  if (rightClickMenu) {
    rightClickMenu.remove();
  }

  const menu = document.createElement("div");
  menu.className = "right-click-menu";
  menu.style.left = event.clientX + "px";
  menu.style.top = event.clientY + "px";

  const menuItem = document.createElement("div");
  menuItem.className = "right-click-menu-item";
  menuItem.innerText = "remove";

  menuItem.addEventListener("click", function () {
    menu.remove();
    const userConfirm = window.confirm(
      `Do you want to proceed and delete '${item.name}' link?`
    );

    if (userConfirm) {
      linkData.splice(index, 1);
      localStorage.setItem("elementString", JSON.stringify(linkData));
      location.reload();
    }
  });

  menu.appendChild(menuItem);
  document.body.appendChild(menu);
  document.body.addEventListener("click", () => {
    menu.remove();
  });
}

function loaddata() {
  const linkData = JSON.parse(localStorage.getItem("elementString"));

  console.log(linkData)

  addlinks.innerHTML = "";

  if (linkData !== null) {
    linkData.forEach((item, index) => {
      const element = createLinkElement(item);

      addlinks.appendChild(element);

      element.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        linkRemoveMenu(e, item, index, linkData);
      });

      element.addEventListener("mouseenter", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(2.5)";
      });

      element.addEventListener("mouseleave", () => {
        cursor.style.transform = "translate(-50%, -50%) scale(1)";
      });
    });
  }
}

window.onload = function () {
  loaddata();
};
