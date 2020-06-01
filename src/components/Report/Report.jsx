import React from 'react'
import "@ui5/webcomponents/dist/Button"
import { LineChart } from '@ui5/webcomponents-react-charts/lib/next/LineChart';

export default _ => {
    return (
        <LineChart
            style={{ width: '100%' }}
            dimensions={[
                {
                    accessor: 'name',
                    formatter: `2019`,
                    interval: 0
                }
            ]}
            measures={[
                {
                    accessor: 'users',
                    label: 'Users'
                },
                {
                    accessor: 'sessions',
                    label: 'Active Sessions'
                },
                {
                    accessor: 'volume',
                    label: 'Vol.'
                }
            ]}
        />
    )
}