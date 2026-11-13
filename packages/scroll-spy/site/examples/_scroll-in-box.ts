/**
 * Previews live inside the site's pages: scroll only their own box on link
 * clicks, so the page does not jump and the site URL keeps its hash.
 */
export const scrollInBox = (nav: Element, box: HTMLElement, gap = 16) =>
  nav.addEventListener('click', event => {
    const link = (event.target as Element).closest('a')
    const section = link?.hash ? box.querySelector<HTMLElement>(link.hash) : null
    if (!section) return
    event.preventDefault()
    const top =
      box.scrollTop + section.getBoundingClientRect().top - box.getBoundingClientRect().top - gap
    box.scrollTo({ top })
  })
