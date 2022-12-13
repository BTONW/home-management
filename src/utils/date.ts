import moment, { Moment} from 'moment'

export const getStackDays = (startDate: Moment, endDate: Moment): Moment[] => {
  const stack: Moment[] = []
  
  const amount = moment
    .duration(endDate.diff(startDate))
    .asDays()

  const date = startDate.clone()

  for (let i = 0; i <= amount; i++) {
    stack.push(moment(date).add(i, 'days'))
  }

  return stack
}