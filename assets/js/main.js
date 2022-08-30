/**
 * Template Name: Regna - v4.8.1
 * Template URL: https://bootstrapmade.com/regna-bootstrap-onepage-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    if (!header.classList.contains("header-scrolled")) {
      offset -= 20;
    }

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
        layoutMode: "fitRows",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();
})();

function searchFood() {
  let inputAllergen = document.getElementById("inputForSearch").value;
  // let UPCresultBox = document.getElementById("searchResultUPCcodes");
  let searchResultArea = document.getElementById("searchResultsArea");

  let url = `https://us.openpetfoodfacts.org/cgi/search.pl?action=process&tagtype_0=categories&tag_contains_0=contains&tag_0=dog_food&json=true&tagtype_1=allergens&tag_contains_1=without&tag_1=${inputAllergen}`;
  // console.log(url);
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      //console.log(data)

      for (let product of data.products) {
        let productName = product.product_name
        let productImage = product.image_url
        let ingredientList = product.ingredients
        console.log(ingredientList) //

        let resultBox = document.createElement("div")
        resultBox.setAttribute(
          "class",
          "col-lg-4 col-md-6 portfolio-item filter-app"
        );

        let result = document.createElement("h4")
        result.innerText = productName
        resultBox.append(result)

        let pic = document.createElement("img")
        pic.setAttribute("src", productImage)
        pic.setAttribute("class", "img-fluid")
        resultBox.append(pic)

        searchResultArea.appendChild(resultBox)
      }
    })
    .catch((err) => console.error(err));
}

function dogFacts() {
  let urlDog =
    "https://dogfacts-api.herokuapp.com/api/v1/resources/dogs?number=5";

  fetch(urlDog, {
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
      origin: "*",
      methods: "GET",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    },
  })
    .then((resp) => resp.json())

    .then((data) => {
      let dogFactArea = document.getElementById("dogFact")
      let factList = document.createElement("ol")

      console.log(data); //data is array of fact objects
      for (let obj of data) {
        let randomFact = obj.fact

        let factEl = document.createElement("li")
        factEl.setAttribute("class", "dogFactListedFacts")
        factEl.innerText = randomFact
        factList.appendChild(factEl)
      }
      dogFactArea.appendChild(factList)
    })

    .catch((err) => console.error(err));
}
