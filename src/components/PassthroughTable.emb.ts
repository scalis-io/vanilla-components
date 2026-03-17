import { defineComponent, definePreview, type EmbeddedComponentMeta } from '@embeddable.com/react'
import { loadData, isDimension, isMeasure } from '@embeddable.com/core'
import PassthroughTable from './PassthroughTable'

export const meta: EmbeddedComponentMeta = {
  name: 'PassthroughTable',
  label: 'Passthrough table',
  classNames: ['inside-card'],
  category: 'Charts: custom',
  inputs: [
    {
      name: 'ds',
      type: 'dataset',
      label: 'Dataset to display',
      category: 'Chart data',
    },
    {
      name: 'primaryMetric',
      type: 'measure',
      label: 'Primary Metric',
      description: 'The main value shown in cells (e.g., Stage-to-Stage Rate %)',
      config: { dataset: 'ds' },
      category: 'Chart data',
    },
    {
      name: 'secondaryMetric',
      type: 'measure',
      label: 'Secondary Metric',
      description: 'Optional count shown in parentheses (e.g., Entered Count)',
      config: { dataset: 'ds' },
      category: 'Chart data',
    },
    {
      name: 'rowDimension',
      type: 'dimension',
      label: 'Row Values',
      description: 'Dimension for table rows (e.g., Month)',
      config: { dataset: 'ds', hideGranularity: true },
      category: 'Chart data',
    },
    {
      name: 'columnDimension',
      type: 'dimension',
      label: 'Column Values',
      description: 'Dimension for table columns (e.g., Stage Label)',
      config: { dataset: 'ds', hideGranularity: true },
      category: 'Chart data',
    },
    {
      name: 'columnOrderDimension',
      type: 'dimension',
      label: 'Column Order',
      description: 'Numeric dimension used to sort columns (e.g., Stage Order)',
      config: { dataset: 'ds', hideGranularity: true },
      category: 'Chart data',
    },
    {
      name: 'granularity',
      type: 'granularity',
      label: 'Granularity (for dates)',
      defaultValue: 'month',
      category: 'Variables to configure',
    },
    {
      name: 'title',
      type: 'string',
      label: 'Title',
      description: 'The title for the table',
      category: 'Chart settings',
    },
    {
      name: 'description',
      type: 'string',
      label: 'Description',
      description: 'The description for the table',
      category: 'Chart settings',
    },
    {
      name: 'emptyStateMessage',
      type: 'string',
      label: 'Empty state message',
      description: 'Message shown when no data is available (e.g., when no filter is selected)',
      category: 'Chart settings',
    },
    {
      name: 'nullValueCharacter',
      type: 'string',
      label: 'Null value character',
      description: 'Character displayed when no data exists',
      defaultValue: '—',
      category: 'Chart settings',
    },
    {
      name: 'dps',
      type: 'number',
      label: 'Number decimal places',
      description: 'Decimal places for rate values',
      defaultValue: 0,
      category: 'Chart settings',
    },
    {
      name: 'fontSize',
      type: 'number',
      label: 'Font size in pixels',
      category: 'Chart styling',
    },
  ],
}

export const preview = definePreview(PassthroughTable, {
  title: 'Passthrough Table',
  results: { isLoading: false, data: [] },
})

export default defineComponent(PassthroughTable, meta, {
  props: (inputs: any, _embeddableState: any, clientContext: any) => {
    const { ds, rowDimension, columnDimension, columnOrderDimension, primaryMetric, secondaryMetric, granularity } =
      inputs

    if (!ds || !isDimension(rowDimension) || !isDimension(columnDimension) || !isMeasure(primaryMetric)) {
      return { ...inputs, results: { isLoading: false, data: [] } }
    }

    const select: any[] = []

    if (rowDimension.nativeType === 'time') {
      select.push({ dimension: rowDimension.name, granularity: granularity || 'month' })
    } else {
      select.push(rowDimension)
    }

    if (columnDimension.nativeType === 'time') {
      select.push({ dimension: columnDimension.name, granularity: granularity || 'month' })
    } else {
      select.push(columnDimension)
    }

    if (columnOrderDimension && isDimension(columnOrderDimension)) {
      select.push(columnOrderDimension)
    }

    select.push(primaryMetric)

    if (secondaryMetric && isMeasure(secondaryMetric)) {
      select.push(secondaryMetric)
    }

    return {
      ...inputs,
      results: loadData({
        from: ds,
        select,
        orderBy: [{ property: rowDimension, direction: 'asc' as const }],
        limit: 10000,
        timezone: clientContext?.timezone || 'UTC',
      }),
    }
  },
})
