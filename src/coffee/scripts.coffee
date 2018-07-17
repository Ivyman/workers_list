class List
  constructor: () ->
    @modalIsOpen = false
    @docEL = document
    @modalEl = null
    @itemsEL = null

  init: () ->
    @modalEl = @docEL.querySelector "[data-modal]"
    @itemsEL = @docEL.querySelectorAll "[data-item]"

    for item in @itemsEL
      item.addEventListener "click", (e) =>
        e.preventDefault()
        @triggerModal()
        return

  triggerModal: (itemId) ->
    if @modalIsOpen
      @modalEl.setAttribute("data-modal", "show")
    else
      @modalEl.setAttribute("data-modal", "hide")
    @modalIsOpen = !@modalIsOpen

instance = new List()
instance.init()





