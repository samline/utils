import type { LandingFactory } from '../../../../../../landing/src/i18n/kit'

const landing: LandingFactory = ({ identity, defaults }) => ({
  ...defaults,
  hero: {
    ...defaults.hero,
    seoTitle: 'Minimal fixture package',
    title: identity.name,
    titleAccent: 'Quiet by design.',
    description: identity.description,
  },
})
export default landing
