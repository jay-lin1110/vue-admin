import moment from 'moment'

const momentFormat = (dateStr, pattern = 'YYYY-MM-DD') => moment(dateStr).format(pattern)

export {
  momentFormat
}
