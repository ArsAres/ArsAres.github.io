function openMenu() {//открывает меню 1уровня на мобильном и планшете при нажатии на бургер
  let dropdownMenu = document.querySelector(".dropdown-menu");
  dropdownMenu.classList.remove("dropdown-menu");
  dropdownMenu.classList.add("dropdown-menu-mobile");
  let dropdownMenuItems = document.querySelectorAll(".dropdown-menu-item");
  dropdownMenuItems.forEach((item) => {
    item.classList.remove("dropdown-menu-item");
    item.classList.add("dropdown-menu-mobile-item");
  });
  let downIcons = document.querySelectorAll(".fas.fa-chevron-down.hidden");
  downIcons.forEach((item) => {
    item.classList.remove("hidden");
  });
}
function closeMenu() {//закрывает меню 1уровня на мобильном и планшете при нажатии на крестик
  let dropdownMenuMobile = document.querySelector(".dropdown-menu-mobile");
  dropdownMenuMobile.classList.remove("dropdown-menu-mobile");
  dropdownMenuMobile.classList.add("dropdown-menu");
  let dropdownMenuMobileItems = document.querySelectorAll(
    ".dropdown-menu-mobile-item"
  );
  dropdownMenuMobileItems.forEach((item) => {
    item.classList.remove("dropdown-menu-mobile-item");
    item.classList.add("dropdown-menu-item");
  });
  let downIcons = document.querySelectorAll(".fas.fa-chevron-down");
  downIcons.forEach((item) => {
    item.classList.add("hidden");
  });
}
function switchMenuToggle(toggle) { //переключает классы бургер/крестик
  if (toggle.children[0].classList[2] === "active") {
    toggle.children[0].classList.remove("active");
    toggle.children[0].classList.add("hidden");
    toggle.children[1].classList.remove("hidden");
    toggle.children[1].classList.add("active");
    openMenu();
  } else {
    toggle.children[1].classList.remove("active");
    toggle.children[1].classList.add("hidden");
    toggle.children[0].classList.remove("hidden");
    toggle.children[0].classList.add("active");
    closeMenu();
  }
}
function autoscrollElemToTop(elem) {//автоскролл открываемого меню вверх
  elem.scrollIntoView({
    block: "start",
    behavior: "smooth",
    
  });
}
function openSubmenu(elem) {//открывает меню 2/3 уровня на мобильном и планшете при нажатии на галочку вниз 
  switch(elem.nextElementSibling.classList[0]){
    case "submenu":
      elem.nextElementSibling.classList.remove("submenu");
      elem.nextElementSibling.classList.add("submenu-mobile");
      for(let i=0;i<elem.nextElementSibling.children.length;i++){
        elem.nextElementSibling.children[i].classList.remove("submenu-item");
        elem.nextElementSibling.children[i].classList.add("submenu-mobile-item");
      }
    break;
    case "submenu-list":
      elem.nextElementSibling.classList.remove("submenu-list");
      elem.nextElementSibling.classList.add("submenu-mobile-list");
      for(let i=0;i<elem.nextElementSibling.children.length;i++){
        elem.nextElementSibling.children[i].classList.remove("submenu-list-item");
        elem.nextElementSibling.children[i].classList.add("submenu-mobile-list-item");
      }
      break;
      default:console.error();
  }
  siblingsCloser(elem);
}
function closeSubmenu(elem) {//закрывает меню 2/3 уровня на мобильном и планшете при нажатии на галочку вверх 
  switch(elem.nextElementSibling.classList[0]){
    case "submenu-mobile":
      elem.nextElementSibling.classList.remove("submenu-mobile");
      elem.nextElementSibling.classList.add("submenu");
      for(let i=0;i<elem.nextElementSibling.children.length;i++){
        elem.nextElementSibling.children[i].classList.remove("submenu-mobile-item");
        elem.nextElementSibling.children[i].classList.add("submenu-item");
      }
    break;
    case "submenu-mobile-list":
      elem.nextElementSibling.classList.remove("submenu-mobile-list");
      elem.nextElementSibling.classList.add("submenu-list");
      for(let i=0;i<elem.nextElementSibling.children.length;i++){
        elem.nextElementSibling.children[i].classList.remove("submenu-mobile-list-item");
        elem.nextElementSibling.children[i].classList.add("submenu-list-item");
      }
      break;
      default:console.error();
  }
}
function siblingsCloser(elem){//закрывает соседние меню одного уровня
let submenuButtons = document.querySelectorAll(".down-icon");
for(let i=0;i<submenuButtons.length;i++){
  if(elem.nextElementSibling.classList[0]==submenuButtons[i].nextElementSibling.classList[0] && elem!==submenuButtons[i]){
    switchSubmenuButtons(submenuButtons[i]);
  }
}

}
function switchSubmenuButtons(elem) {//переключает классы галочек вверх/вниз попутно открывая/закрывая вложенные меню
  
  if (elem.children[1].classList[2] === "hidden") {
    elem.children[0].classList.add("hidden");
    elem.children[1].classList.remove("hidden");
    openSubmenu(elem);
  } else {
    elem.children[1].classList.add("hidden");
    elem.children[0].classList.remove("hidden");
    closeSubmenu(elem);
  }
}

let burgerMenuToggle = document.querySelector(".burger-menu");//кнопка бургера
let submenuButtons = document.querySelectorAll(".down-icon");//коллекция слушаемых галочек

burgerMenuToggle.addEventListener("click", function () {//обработчик бургера
  switchMenuToggle(burgerMenuToggle);
});

submenuButtons.forEach((item) => {//обработчики для каждой галочки из коллекции
  item.addEventListener("click", function () {
    autoscrollElemToTop(item);
    switchSubmenuButtons(item);
  });
});
