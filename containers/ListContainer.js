import React, { Component } from 'react'
import {
  StyleSheet,
  ListView,
  View,
  Text,
  TouchableHighlight,
} from 'react-native'
import { connect } from 'react-redux'
import FilterContainer from './FilterContainer.js'
import SectionHeader from '../components/SectionHeader.js'
import Header from '../components/Header.js'
import ModalContainer from './ModalContainer.js'
import RowLayout from '../components/RowLayout.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

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

const ListContainer = ({ dataSource, onPress }) => (
  <View>
    <ListView
      dataSource={dataSource}
      renderRow={(rowData, sectionID, rowID, highlightRow) => (
        <TouchableHighlight style = {styles.container} onPress={() => onPress(rowID)}>
        <Text style={styles.text}>{rowData.name}</Text>
        </TouchableHighlight>
      )}
      renderHeader={renderHeader}
      renderSectionHeader={renderSectionHeader}
    />
  </View>
)

function renderHeader() {
  return (
    <View>
      <Header/>
      <FilterContainer />
    </View>
  )
}

function renderSectionHeader(sectionData, sectionID) {
  return (
      <SectionHeader title={ sectionID }/>
  )
}

export default connect(
  mapStateToProps,
)(ListContainer)
