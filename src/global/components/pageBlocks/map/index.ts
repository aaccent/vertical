const structureList = document.querySelectorAll<HTMLElement>('.infrastructure-list__item')
console.log(structureList)

const renderStructureList = () => {
  if(document.querySelectorAll(".infrastructure-list__item_active").length === 0){
    document.querySelector(".infrastructure-list__bottom")?.classList.remove("infrastructure-list__bottom_active")
  }else{
    document.querySelector(".infrastructure-list__bottom")?.classList.add("infrastructure-list__bottom_active")
  }
  structureList.forEach((x, index: number) => {
    x.classList.remove('infrastructure-list_disable-border')
    if (!structureList[index].classList.contains('infrastructure-list__item_active')) return
  
    const prevItem = structureList[index - 1]
    const nextItem = structureList[index + 1]
  
    if (index - 1 < 0) return
  
    if (!prevItem.classList.contains('infrastructure-list__item_active')) {
      prevItem.classList.add('infrastructure-list_disable-border')
      return
    }
  
    if (index + 1 >= structureList.length) return
    if (!nextItem.classList.contains('infrastructure-list__item_active')) {
      nextItem.classList.add('infrastructure-list_disable-border')
    }
  })
}

structureList.forEach(x => {
  x.addEventListener('click', (e) => {
    x.classList.toggle("infrastructure-list__item_active")
    renderStructureList()

  })
})

renderStructureList()