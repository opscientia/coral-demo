interface ProfileLink {
  name: string
  value: string
}

interface Profile {
  did?: string
  name?: string
  accountEns?: string
  description?: string
  emoji?: string
  image?: string
  links?: ProfileLink[]
}
