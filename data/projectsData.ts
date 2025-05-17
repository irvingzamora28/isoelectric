interface Project {
  title: string
  description: string
  href?: string
  imgSrc?: string
}

const projectsData: Project[] = [
  {
    title: 'The Last of Us',
    description: `A post-apocalyptic survival game set in the United States after a pandemic
    outbreak.`,
    imgSrc: '/static/images/the-last-of-us.webp',
    href: 'https://en.wikipedia.org/wiki/The_Last_of_Us',
  },
  {
    title: 'The Legend of Zelda: Breath of the Wild',
    description: `An open-world action-adventure game set in the fictional kingdom of Hyrule.`,
    imgSrc: '/static/images/zelda-botw.jpg',
    href: '/blog/zelda-botw',
  },
]

export default projectsData
