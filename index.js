const proxyurl = "https://cors-anywhere.herokuapp.com/";

const cleanName = str => {
  return str.toLowerCase().trim()
}

const getData = async url => {
  try {
    const response = await fetch(proxyurl + url)
    const contents = await response.json()
    return contents
  } catch (err) {
    console.log(`Can't access ${url} response. Blocked by browser?`)
  }
}

const init = async () => {
  let nameChanged = []
  let newObject = {}
  let treeDataSimplified = []

  try {
    const seoTextData = await getData('https://www.plazavea.com.pe/files/seoText.json')
    const treeData = await getData('https://www.plazavea.com.pe/api/catalog_system/pub/category/tree/3')

    treeData.forEach(item => {
      treeDataSimplified.push(item)
    })
    
    seoTextData.electro.forEach(item => {
      treeData.forEach(treeItem => {
        // Find in base level, not children
        if (treeItem.id == item.categoryId) {
          if (cleanName(treeItem.name) !== cleanName(item.categoryName)) {
            newObject = {
              seoTextCat: item,
              treeDataCat: {
                id: treeItem.id,
                MetaTagDescription: treeItem.MetaTagDescription,
                Title: treeItem.Title,
                hasChildren: treeItem.hasChildren,
                name: treeItem.name,
                url: treeItem.url
              }
            }

            nameChanged.push(newObject)
          }
        }
        
        // Find in first level children
        if (treeItem.hasChildren) {
          console.log('finding sublevel 1')
          treeItem.children.forEach(treeItemChildLvl1 => {
            if (treeItemChildLvl1.id == item.categoryId) {
              if (cleanName(treeItemChildLvl1.name) !== cleanName(item.categoryName)) {
                newObject = {
                  seoTextCat: item,
                  treeDataCat: {
                    id: treeItemChildLvl1.id,
                    MetaTagDescription: treeItemChildLvl1.MetaTagDescription,
                    Title: treeItemChildLvl1.Title,
                    hasChildren: treeItemChildLvl1.hasChildren,
                    name: treeItemChildLvl1.name,
                    url: treeItemChildLvl1.url
                  }
                }

                nameChanged.push(newObject)
              }
            }

            // Find in second level children
            if (treeItemChildLvl1.hasChildren) {
              treeItemChildLvl1.children.forEach(treeItemChildLvl2 => {
                if (treeItemChildLvl2.id == item.categoryId) {
                  if (cleanName(treeItemChildLvl2.name) !== cleanName(item.categoryName)) {
                    newObject = {
                      seoTextCat: item,
                      treeDataCat: {
                        id: treeItemChildLvl2.id,
                        MetaTagDescription: treeItemChildLvl2.MetaTagDescription,
                        Title: treeItemChildLvl2.Title,
                        hasChildren: treeItemChildLvl2.hasChildren,
                        name: treeItemChildLvl2.name,
                        url: treeItemChildLvl2.url
                      }
                    }

                    nameChanged.push(newObject)
                  }
                  
                  // Find in third level children
                  if (treeItemChildLvl2.hasChildren) {
                    treeItemChildLvl2.forEach(treeItemChildLvl3 => {
                      if (treeItemChildLvl3.id == item.categoryId) {
                        if (cleanName(treeItemChildLvl3.name) !== cleanName(item.categoryName)) {
                          newObject = {
                            seoTextCat: item,
                            treeDataCat: {
                              id: treeItemChildLvl3.id,
                              MetaTagDescription: treeItemChildLvl3.MetaTagDescription,
                              Title: treeItemChildLvl3.Title,
                              hasChildren: treeItemChildLvl3.hasChildren,
                              name: treeItemChildLvl3.name,
                              url: treeItemChildLvl3.url
                            }
                          }

                          nameChanged.push(newObject)
                        }
                      }
                    })
                  }
                }
              })
            }
          })
        }
      })
    })

    console.log('treeData', treeData)
    console.log('seoTextData', seoTextData.electro)
    console.log('name changed', nameChanged)

  } catch (err) {
    console.log(err)
  }
}

init()