import React, { Component } from 'react'
import {
  StyleSheet,
  ListView,
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import SectionHeader from '../components/SectionHeader.js'

const mapStateToProps = (state) => {
  const dataBlob = {
    minSchedules: state.schedules.minById,
    byTime: state.schedules.byTime,
  }

  const sectionIdentities = Object.keys(state.schedules.byTime).sort((a, b) => a - b)

  const rowIdentities = sectionIdentities.reduce((rowIds, sectionId) => ([
    ...rowIds,
    state.schedules.byTime[sectionId],
  ]), [])

  const getSectionData = (dataBlob, sectionId) => sectionId
  const getRowData = (dataBlob, sectionId, rowId) => dataBlob.minSchedules[rowId]

  const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2,
    sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
    getSectionData,
    getRowData,
  })

  return {
    dataSource: ds.cloneWithRowsAndSections(dataBlob, sectionIdentities, rowIdentities),
  }
}

const ListContainer = ({ dataSource }) => (
  <ListView
    dataSource={dataSource}
    renderRow={(rowData, sectionID, rowID, highlightRow) => <Text>{rowData.name}</Text>}
    renderHeader={renderHeader}
    renderSectionHeader={renderSectionHeader}
  />
)

function renderHeader() {
  return (
    <Header/>
  )
}

function renderSectionHeader(sectionData, sectionID) {
  return (
      <Text>{sectionID}</Text>
  )
}

export default connect(
  mapStateToProps,
)(ListContainer)
