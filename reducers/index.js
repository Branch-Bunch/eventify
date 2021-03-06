import {
  FETCH_SCHEDULES,
  UPDATE_FILTER,
  FETCH_DETAILED_SCHEDULE,
  UPDATE_SELECTED_ID,
} from '../actions'
import { combineReducers } from 'redux'

const initalState = {
  schedules: {
    minById: {},
    byTime: {},
    detById: {},
  },
  currentFilter: '',
  tags: [],
  selectedId: '',
}

const schedules = (state = initalState.schedules, action) => {
  switch (action.type) {
    case FETCH_SCHEDULES:
      const minById = action.schedules.reduce((byId, schedule) => ({
          ...byId,
          [schedule.id]: schedule
      }), state.minById)

      const byTime = action.schedules
        .reduce((times, schedule) => {
          const prevTimes = times[schedule.time] || []
          return {
            ...times,
            [schedule.time]: [...prevTimes, schedule.id]
          }
        }, {})

      return {
        ...state,
        minById,
        byTime,
      }

    case UPDATE_FILTER:
      switch (action.filter) {
      case '':
        return {
          ...state,
          byTime: Object.keys(state.minById).reduce((times, id) => {
            const prevTimes = times[state.minById[id].time] || []
            return {
              ...times,
              [state.minById[id].time]: [...prevTimes, id]
            }
          }, {})
      }
      default:
        return {
          ...state,
          byTime: Object.keys(state.byTime).reduce((map, time) => ({
            ...map,
            [time]: state.byTime[time]
              .filter(id => state.minById[id].tag === action.filter)
          }), {})
        }
      }

    case FETCH_DETAILED_SCHEDULE:
      return {
        ...state,
        detById: {
          ...state.detById,
          [action.schedule.id]: action.schedule,
        },
      }

    default:
      return state
  }
}

const currentFilter = (state = initalState.currentFilter, action) => {
  switch (action.type) {
    case UPDATE_FILTER:
      return action.filter
    default:
      return state
  }
}


const tags = (state = initalState.tags, action) => {
  switch (action.type) {
    case FETCH_SCHEDULES:
      const tagSet = new Set()
      action.schedules.forEach(schedule => tagSet.add(schedule.tag))
      return Array.from(tagSet)
    default:
      return state
    }
  }

const selectedId = (state = initalState.selectedId, action) => {
  switch (action.type) {
    case UPDATE_SELECTED_ID:
    return action.id
  default:
    return state
  }
}

export default combineReducers({
  tags,
  currentFilter,
  schedules,
  selectedId,
})
