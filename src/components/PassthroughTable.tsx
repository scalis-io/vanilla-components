import { useTheme } from '@embeddable.com/react'
import React, { useMemo } from 'react'
import type { Dimension, Measure, DataResponse } from '@embeddable.com/core'

type Props = {
  title?: string
  description?: string
  emptyStateMessage?: string
  nullValueCharacter?: string
  dps?: number
  fontSize?: number
  rowDimension?: Dimension
  columnDimension?: Dimension
  columnOrderDimension?: Dimension
  primaryMetric?: Measure
  secondaryMetric?: Measure
  results: DataResponse
}

export default function PassthroughTable({
  title,
  description,
  emptyStateMessage,
  nullValueCharacter = '—',
  dps = 0,
  fontSize,
  rowDimension,
  columnDimension,
  columnOrderDimension,
  primaryMetric,
  secondaryMetric,
  results,
}: Props) {
  const theme = useTheme() as any
  const fontSizePx = fontSize ? `${fontSize}px` : theme?.font?.size || '14px'

  const { columns, rows, lookup } = useMemo(() => {
    if (!results?.data?.length || !rowDimension || !columnDimension || !primaryMetric) {
      return { columns: [], rows: [], lookup: new Map() }
    }

    const data = results.data
    const rowKey = rowDimension.name
    const colKey = columnDimension.name
    const orderKey = columnOrderDimension?.name
    const primaryKey = primaryMetric.name
    const secondaryKey = secondaryMetric?.name

    const colOrderMap = new Map<string, number>()
    if (orderKey) {
      data.forEach((row) => {
        const col = row[colKey] as string
        const order = row[orderKey] as number
        if (col != null && order != null && !colOrderMap.has(col)) {
          colOrderMap.set(col, order)
        }
      })
    }

    const cols = [...new Set(data.map((row) => row[colKey] as string))].sort((a, b) => {
      if (colOrderMap.size > 0) {
        return (colOrderMap.get(a) ?? Infinity) - (colOrderMap.get(b) ?? Infinity)
      }
      return a < b ? -1 : a > b ? 1 : 0
    })

    const rws = [...new Set(data.map((row) => row[rowKey] as string))].sort()

    const lk = new Map<string, { primary: any; secondary: any }>()
    data.forEach((row) => {
      const key = `${row[rowKey]}|${row[colKey]}`
      lk.set(key, {
        primary: row[primaryKey],
        secondary: secondaryKey ? row[secondaryKey] : undefined,
      })
    })

    return { columns: cols, rows: rws, lookup: lk }
  }, [results, rowDimension, columnDimension, columnOrderDimension, primaryMetric, secondaryMetric])

  const centeredContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    textAlign: 'center',
  }

  if (results?.isLoading) {
    return <div style={{ ...centeredContainerStyle, color: '#9ca3af' }}>Loading...</div>
  }

  if (results?.error) {
    return <div style={{ ...centeredContainerStyle, color: '#ef4444' }}>{results.error}</div>
  }

  if (!rows.length) {
    return <div style={{ ...centeredContainerStyle, color: '#9ca3af' }}>{emptyStateMessage || 'No results'}</div>
  }

  const formatRowValue = (value: any): string => {
    if (!value) return nullValueCharacter
    const date = new Date(value)
    if (isNaN(date.getTime())) return String(value)
    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  }

  const formatCell = (primary: any, secondary: any): string => {
    if (primary == null && secondary == null) return nullValueCharacter

    // First stage: rate is null, show just the count
    if (primary == null && secondary != null) {
      return typeof secondary === 'number' ? secondary.toLocaleString() : String(secondary)
    }

    // Rate + count: show "79% (95)"
    if (primary != null && secondary != null) {
      const rate = typeof primary === 'number' ? primary.toFixed(dps) : primary
      const count = typeof secondary === 'number' ? secondary.toLocaleString() : secondary
      return `${rate}% (${count})`
    }

    // Rate only (no secondary metric configured)
    if (primary != null) {
      if (typeof primary === 'number') {
        return dps != null ? `${primary.toFixed(dps)}%` : `${primary}%`
      }
      return String(primary)
    }

    return nullValueCharacter
  }

  const thStyle: React.CSSProperties = {
    fontSize: fontSizePx,
    padding: '8px 12px',
    textAlign: 'left',
    borderBottom: '2px solid #e5e7eb',
    whiteSpace: 'nowrap',
    fontWeight: 600,
  }

  const tdStyle: React.CSSProperties = {
    fontSize: fontSizePx,
    padding: '6px 12px',
    borderBottom: '1px solid #f0f0f0',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      {title && <div style={{ padding: '12px 16px 4px', fontWeight: 600, fontSize: '16px' }}>{title}</div>}
      {description && <div style={{ padding: '0 16px 8px', fontSize: '13px', color: '#6b7280' }}>{description}</div>}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th
                style={{
                  ...thStyle,
                  position: 'sticky',
                  left: 0,
                  background: '#fafafa',
                  zIndex: 1,
                  minWidth: '120px',
                }}
              >
                {rowDimension?.title || ''}
              </th>
              {columns.map((col) => (
                <th
                  key={col}
                  style={{ ...thStyle, minWidth: '130px' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td
                  style={{
                    ...tdStyle,
                    position: 'sticky',
                    left: 0,
                    background: '#fff',
                    zIndex: 1,
                    fontWeight: 500,
                  }}
                >
                  {formatRowValue(row)}
                </td>
                {columns.map((col) => {
                  const cellData = lookup.get(`${row}|${col}`)
                  return (
                    <td
                      key={col}
                      style={tdStyle}
                    >
                      {cellData ? formatCell(cellData.primary, cellData.secondary) : nullValueCharacter}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
