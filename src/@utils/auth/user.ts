import User from '../../models/User'
import jwt from 'jsonwebtoken'
export async function createUser(
  orcidname: string,
  orcid: string,
  accessToken: string
): Promise<any> {
  const newUser = new User({
    username: orcidname,
    orcid,
    accessToken,
    createdAt: Date.now()
  })
  await newUser.save()

  if (newUser) {
    const token = jwt.sign(
      { id: newUser._id, created: Date.now().toString() },
      process.env.COOKIE_SECRET
    )
    newUser.tokens.push(token)
    await newUser.save()
  }
  return newUser
}

export async function findUser(userOrcid: string): Promise<any> {
  const foundUser = await User.findOne({ orcid: userOrcid })
  if (foundUser !== null) {
    // already have this user
    const token = jwt.sign(
      { id: foundUser._id, created: Date.now().toString() },
      process.env.COOKIE_SECRET
    )
    foundUser.tokens.push(token)
    return foundUser
  } else {
    return null
  }
}
