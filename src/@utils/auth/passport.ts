import OrcidStrategy from 'passport-orcid'
import { createUser, findUser } from './user'
export const OrcidAuth = new OrcidStrategy(
  {
    sandbox: true, // remove this to use the production API
    state: false, // remove this if not using sessions
    clientID: process.env.NEXT_PUBLIC_ORCID_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_ORCID_CLIENT_SECRET,
    callbackURL: '/auth/orcid/redirect'
  },
  async (accessToken, refreshToken, params, profile, done) => {
    // `profile` is empty as ORCID has no generic profile URL,
    // so populate the profile object from the params instead
    profile = { orcid: params.orcid, name: params.name }
    let currentUser = await findUser(profile.orcid)
    if (currentUser !== null) {
      // User already exists, log their info
      console.log('User is:' + currentUser)
      const { tokens } = currentUser
      done(null, currentUser, { message: 'Auth successful', tokens })
    } else {
      // new user
      currentUser = await createUser(profile.name, profile.orcid, accessToken)
      console.log('User is:' + currentUser)
      const { tokens } = currentUser
      done(null, currentUser, { message: 'Auth successful', tokens })
    }
  }
)
