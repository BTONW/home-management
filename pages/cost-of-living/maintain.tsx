import { FC } from 'react'
import withMaster from '@hm-utils/withMaster'
import Module from '@hm-modules/cost-of-living/maintain'

const Page: FC = () => <Module />

export const getStaticProps = () => withMaster(() => Promise.resolve({
  breadcrumbs: [
    { text: 'Home', path: '/' },
    { text: 'Cost of living', path: '/cost-of-living/report' },
    { text: 'Maintain' }
  ],
}))

export default Page