import type { LandingFactory } from '../../../../../../landing/src/i18n/kit'

const landing: LandingFactory = ({ identity, defaults }) => ({
  ...defaults,
  hero: {
    ...defaults.hero,
    seoTitle: 'Uppercase text in the browser',
    title: identity.name,
    titleAccent: 'Loud on purpose.',
    description: identity.description,
  },
})
export default landing
