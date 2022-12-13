import { FC } from 'react'
import { MasterTypes } from '@hm-dto/utils.dto'
import withMaster from '@hm-utils/withMaster'
import Module from '@hm-modules/cost-of-living/report'

const Page: FC = () => <Module />

export const getStaticProps = () => withMaster(() => Promise.resolve({
  breadcrumbs: [
    { text: 'Home', path: '/' },
    { text: 'Cost of living', path: '/cost-of-living/report' },
    { text: 'Report' }
  ],
}), [MasterTypes.BUDGETS])

export default Page