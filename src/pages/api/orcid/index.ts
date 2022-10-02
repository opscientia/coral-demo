import dbConnect from '@utils/auth/database'
import '@utils/auth/passport'
import passport from 'passport'
export default async function (req, res, next) {
  await dbConnect()
  passport.authenticate('orcid', {
    scope: ['/authenticate'],
    session: false
  })(req, res, next)
}
