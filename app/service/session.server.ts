import type { DataFunctionArgs, Session } from '@remix-run/node'
import { createCookieSessionStorage } from '@remix-run/node'
import * as O from 'fp-ts/lib/Option'

export const PAGE_SESSION_KEYS = { ROOM: 'ROOM', MAIN: 'MAIN' }
export type Message = {
  kind: string
  status: 'success' | 'error' | 'info' | 'warning'
  text: string
}
const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: '__session',
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET], // This should be an env variable
    secure: process.env.NODE_ENV === 'production',
  },
})

const getSessionFromHeaders = ({ headers }: Pick<Request, 'headers'>) => getSession(headers.get('Cookie'))

type WithSessionFn<R> = (args: DataFunctionArgs & { session: Session }) => Promise<R>

const withSession =
  <R>(fn: WithSessionFn<R>) =>
  async (args: DataFunctionArgs) =>
    await fn({ ...args, session: await getSessionFromHeaders(args.request) })

const flushPageSession = (session: Session) => (key: keyof typeof PAGE_SESSION_KEYS, value: Message) =>
  session.flash(key, value)

function getPageSessionData(session: Session, key: keyof typeof PAGE_SESSION_KEYS) {
  return O.fromNullable<Message>(session.get(key))
}

const unsetSessionData = (session: Session) => (key: keyof typeof PAGE_SESSION_KEYS) => session.unset(key)

export {
  commitSession,
  destroySession,
  flushPageSession,
  getPageSessionData,
  getSession,
  // getSessionData,
  // setSessionData,
  getSessionFromHeaders,
  unsetSessionData,
  withSession,
}
