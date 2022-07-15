import React, {
  createContext,
  useContext,
  ReactElement,
  ReactNode,
  useState,
  useEffect
} from 'react'
import { isBrowser } from '@utils/index'
import { useMarketMetadata } from './MarketMetadata'

interface UserPreferencesValue {
  privacyPolicySlug: string
  showPPC: boolean
  bookmarks: string[]
  addBookmark: (did: string) => void
  removeBookmark: (did: string) => void
  setPrivacyPolicySlug: (slug: string) => void
  setShowPPC: (value: boolean) => void
  locale: string
}

const UserPreferencesContext = createContext(null)

const localStorageKey = 'commons-user-preferences-v4'

function getLocalStorage(): UserPreferencesValue {
  const storageParsed =
    isBrowser && JSON.parse(window.localStorage.getItem(localStorageKey))
  return storageParsed
}

function setLocalStorage(values: Partial<UserPreferencesValue>) {
  return (
    isBrowser &&
    window.localStorage.setItem(localStorageKey, JSON.stringify(values))
  )
}

function UserPreferencesProvider({
  children
}: {
  children: ReactNode
}): ReactElement {
  const { appConfig } = useMarketMetadata()
  const localStorage = getLocalStorage()
  // Set default values from localStorage
  const [locale, setLocale] = useState<string>()
  const [bookmarks, setBookmarks] = useState(localStorage?.bookmarks || [])
  const { defaultPrivacyPolicySlug } = appConfig

  const [privacyPolicySlug, setPrivacyPolicySlug] = useState<string>(
    localStorage?.privacyPolicySlug || defaultPrivacyPolicySlug
  )

  const [showPPC, setShowPPC] = useState<boolean>(
    localStorage?.showPPC !== false
  )

  // Write values to localStorage on change
  useEffect(() => {
    setLocalStorage({
      bookmarks,
      privacyPolicySlug,
      showPPC
    })
  }, [bookmarks, privacyPolicySlug, showPPC])

  // Get locale always from user's browser
  useEffect(() => {
    if (!window) return
    setLocale(window.navigator.language)
  }, [])

  function addBookmark(didToAdd: string): void {
    const newPinned = [...bookmarks, didToAdd]
    setBookmarks(newPinned)
  }

  function removeBookmark(didToAdd: string): void {
    const newPinned = bookmarks.filter((did: string) => did !== didToAdd)
    setBookmarks(newPinned)
  }

  // Bookmarks old data structure migration
  useEffect(() => {
    if (bookmarks.length !== undefined) return
    const newPinned: string[] = []
    for (const network in bookmarks) {
      ;(bookmarks[network] as unknown as string[]).forEach((did: string) => {
        did !== null && newPinned.push(did)
      })
    }
    setBookmarks(newPinned)
  }, [bookmarks])

  return (
    <UserPreferencesContext.Provider
      value={
        {
          locale,
          bookmarks,
          privacyPolicySlug,
          showPPC,
          addBookmark,
          removeBookmark,
          setPrivacyPolicySlug,
          setShowPPC
        } as UserPreferencesValue
      }
    >
      {children}
    </UserPreferencesContext.Provider>
  )
}

// Helper hook to access the provider values
const useUserPreferences = (): UserPreferencesValue =>
  useContext(UserPreferencesContext)

export { UserPreferencesProvider, useUserPreferences }
