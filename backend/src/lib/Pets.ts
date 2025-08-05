import _ from 'lodash'

export const pets = _.times(100, (i) => ({
  nick: `p-${i}`,
  name: `Name ${i}`,
  text: _.times(100, (j) => `<p>Text paragrph ${j} of pet ${i}...</p>`).join(''),
}))
