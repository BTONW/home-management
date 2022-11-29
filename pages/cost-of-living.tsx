import { FC } from 'react'
import withMaster from '@hm-utils/withMaster'
import Module from '@hm-modules/CostOfLiving'

const Page: FC = () => <Module />

export const getStaticProps = () => withMaster(() => Promise.resolve({
  breadcrumbs: [
    { text: 'Home', path: '/' },
    { text: 'Cost of living' }
  ],
}))

export default Page