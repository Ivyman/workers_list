class List
  constructor: () ->
    @modalIsOpen = false
    @docEl = document
    @modalEl = null
    @itemsEl = null
    @sliderEl = null
    @isSliderInit = false

  init: () ->
    @modalEl = @docEl.querySelector "[data-modal]"
    @itemsEl = @docEl.querySelectorAll "[data-item]"

    for item in @itemsEl
      item.addEventListener "click", (e) =>
        e.preventDefault()
        itemId = e.target.getAttribute("data-item")
        if itemId != null
          @triggerModal(itemId)

  triggerModal: (itemId) ->
    if @modalIsOpen
      @modalEl.setAttribute("data-modal", "hide")
    else
      @modalEl.setAttribute("data-modal", "show")
      @sliderInit()
      @sliderEl.slideTo(itemId, 0)
    @modalIsOpen = !@modalIsOpen

  sliderInit: () ->
    if !@isSliderInit
      @sliderEl = new Swiper ".swiper-container", {
        effect: "coverflow",
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }
      }
      @isSliderInit = true


window.onload = ->
  instance = new List()
  instance.init()






