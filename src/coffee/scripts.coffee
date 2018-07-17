class List
  constructor: () ->
    @modalIsOpen = false
    @docEL = document
    @modalEl = null
    @itemsEL = null
    @swiper = null

  init: () ->
    @modalEl = @docEL.querySelector "[data-modal]"
    @itemsEL = @docEL.querySelectorAll "[data-item]"
    @swiper = new Swiper ".swiper-container", {
      effect: "coverflow",
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }
    }

    for item in @itemsEL
      item.addEventListener "click", (e) =>
        e.preventDefault()
        itemId = e.target.getAttribute("data-item")
        if itemId != null
          @triggerModal(itemId)
        return

  triggerModal: (itemId) ->
    if @modalIsOpen
      @modalEl.setAttribute("data-modal", "show")
    else
      @modalEl.setAttribute("data-modal", "hide")
    @modalIsOpen = !@modalIsOpen


window.onload = ->
  instance = new List()
  instance.init()






