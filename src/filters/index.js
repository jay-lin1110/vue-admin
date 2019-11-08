import moment from 'moment'

const formatTime = (dateStr, pattern = 'YYYY-MM-DD hh:mm:ss') => moment(dateStr).format(pattern)

export {
  formatTime
}
