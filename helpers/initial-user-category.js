exports.newUserObj = (id) => {
  return {
    id
  }
}

const categories = ['body', 'anim', 'natu', 'econ', 'tran', 'time', 'home', 'foo1', 'foo2', 'fash', 'tour'];
const categoryLevels = {
  body: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  anim: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  natu: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  econ: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  tran: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  time: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  home: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  foo1: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  foo2: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  fash: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ],
  tour: [
    { level: '1', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '2', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '3', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '4', variants: ['a', 'b', 'c', 'd', 'e']},
    { level: '5', variants: ['a', 'b', 'c', 'd', 'e']},
  ]
}

exports.createInitialCategoryStatus = () => {
  const result = [];

  categories.forEach(category => {
    const newCategory = {
      category_id: category,
      levels: []
    }

    categoryLevels[category].forEach(lev => {
      const newLevel = {
        level_id: lev.level,
        enabled: lev.level === '1',
        variants: []
      }

      lev.variants.forEach(variant => {
        const newVariant = {
          variant_id: variant,
          enabled: lev.level === '1' && variant === 'a',
          result: 0,
        }
        newLevel.variants.push(newVariant);
      })
      newCategory.levels.push(newLevel);
    })
    result.push(newCategory);
  })

  return result;
}

