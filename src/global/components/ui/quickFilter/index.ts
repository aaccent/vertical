const quickFilterItem = document.querySelectorAll<HTMLElement>('.quick-filter__item')

const clearExceptOne = (nodes: any, index: number, className = 'quick-filter_border-right') => {
  console.log(nodes)

  nodes.forEach((item: any, _index: number) => {
    console.log(item)
    if (index === _index) return

    item.classList.remove(className)
  })
}

quickFilterItem.forEach((item, index) => {
  item.addEventListener('click', () => {
    console.log(index)
    item.classList.add('quick-filter_active')
    clearExceptOne(quickFilterItem, index, 'quick-filter_active')

    if (index + 1 < quickFilterItem.length - 1) {
      if (index + 2 === quickFilterItem.length - 1) {
        quickFilterItem[index + 2].classList.add('quick-filter_border-left')
        clearExceptOne(quickFilterItem, index + 2, 'quick-filter_border-left')
      }else{
        quickFilterItem[index + 2].classList.add('quick-filter_border-right')
        clearExceptOne(quickFilterItem, index + 2, 'quick-filter_border-right')
      }
    } else if (index - 1 > 0) {
      quickFilterItem[index - 2].classList.add('quick-filter_border-right')
      clearExceptOne(quickFilterItem, index - 2)
    } else {
      clearExceptOne(quickFilterItem, -1, 'quick-filter_border-right')
      clearExceptOne(quickFilterItem, -1, 'quick-filter_border-left')
    }
  })
})
